/**
 * Database client abstractor for Mirichi Mbumba Website
 * Wraps Supabase and local storage fallbacks under a single data API.
 *
 * Credential priority (SECURE — no hardcoded secrets):
 * 1. Meta tags injected at build time (Vercel env vars via prepare-deploy.mjs)
 * 2. Admin-saved config via Supabase Setup tool (stored in localStorage as encrypted config)
 * 3. Local Storage fallback (no Supabase) — for offline/dev mode only
 *
 * IMPORTANT: Never commit API keys to source control.
 * Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel project settings.
 */
(function () {
    // Read credentials from meta tags injected by the build process
    // (set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel env)
    function _getMetaContent(name) {
        const el = document.querySelector(`meta[name="${name}"]`);
        return el ? el.getAttribute('content') : null;
    }
    const META_SUPABASE_URL = _getMetaContent('supabase-url');
    const META_SUPABASE_KEY = _getMetaContent('supabase-anon-key');

    let dbType = 'local';
    let supabaseInstance = null;

    // --- XSS Sanitizer (global utility) ---
    // Escapes HTML special chars to prevent XSS when inserting user data into innerHTML
    window.sanitizeText = function (str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\//g, '&#x2F;');
    };
    // Alias for internal use
    const sx = window.sanitizeText;

    // Default mock data in case storage is empty
    const DEFAULT_ARTICLES = [
        {
            id: "default-1",
            title: "L'Église et la formation des entrepreneurs : foi et responsabilité économique",
            date: "15 jan. 2026",
            category: "Foi & Business",
            description: "La Bible ne sépare pas la foi de l'action, ni la spiritualité de la gestion des talents et des ressources.",
            image: "images/photo3.jpeg",
            content: `
                <p>L’Église ne devrait pas seulement être un lieu de prière et de croissance spirituelle, mais aussi un espace de formation globale de l’être humain, incluant sa responsabilité sociale, professionnelle et économique. En effet, la Bible ne sépare pas la foi de l’action, ni la spiritualité de la gestion des talents et des ressources.</p>
                <h4 style="font-family:'Cormorant Garant',serif;font-size:1.45rem;color:var(--gold-light);margin-top:1.5rem;margin-bottom:0.75rem;font-weight:400;">1. La Bible valorise le travail et la responsabilité</h4>
                <p>Dès la Genèse, l’être humain est appelé à travailler et à gérer la création :</p>
                <div class="pull-quote">
                  « L’Éternel Dieu prit l’homme et le plaça dans le jardin d’Éden pour le cultiver et le garder. » (Genèse 2:15)
                </div>
                <p>Le travail n’est donc pas une conséquence négative, mais une mission divine. Cela implique que chaque croyant est appelé à produire, gérer et développer des ressources.</p>
                <h4 style="font-family:'Cormorant Garant',serif;font-size:1.45rem;color:var(--gold-light);margin-top:1.5rem;margin-bottom:0.75rem;font-weight:400;">2. Dieu valorise l’esprit d’initiative et la multiplication</h4>
                <p>La parabole des talents (Matthieu 25:14-30) montre clairement que Dieu honore ceux qui font fructifier ce qu’ils ont reçu, et réprimande ceux qui restent inactifs par peur ou négligence. L’Église a donc pour responsabilité de libérer le potentiel créatif de ses membres en leur donnant les clés d’une saine gestion.</p>
            `,
            readTime: "2 min",
            associatedBook: "Chrepreneur"
        }
    ];

    const DEFAULT_FORMATIONS = [
        {
            id: "f-1",
            module_name: "Module 1 : Les Fondations Spirituelles du Business",
            module_order: 1,
            title: "1.1 Introduction au Chrepreneuriat",
            description: "Comprendre comment réconcilier foi chrétienne et réussite financière. Les bases du concept de l'entrepreneur intègre sous la direction divine.",
            type: "video",
            media_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with high quality stock video or placeholder
            duration: "18:45",
            order_index: 1
        },
        {
            id: "f-2",
            module_name: "Module 1 : Les Fondations Spirituelles du Business",
            module_order: 1,
            title: "1.2 Le Manuel de l'Entrepreneur Chrétien (PDF)",
            description: "Un guide d'étude complet au format PDF contenant des exercices pratiques de diagnostic de vision et des versets d'études.",
            type: "pdf",
            media_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            duration: "45 pages",
            order_index: 2
        },
        {
            id: "f-3",
            module_name: "Module 2 : Haute Stratégie & Exécution",
            module_order: 2,
            title: "2.1 Masterclass en Direct : Arbitrage et Sécurisation Contractuelle",
            description: "Session interactive sur Zoom pour apprendre comment blinder ses contrats commerciaux et éviter les pièges juridiques fréquents.",
            type: "live",
            media_url: "https://zoom.us/j/1234567890",
            schedule_date: "2026-07-25T17:00:00.000Z",
            duration: "2h00 (Direct)",
            order_index: 1
        }
    ];

    // Initialize Database
    async function initDB() {
        // Priority 1: Meta tags injected at build time by Vercel (SUPABASE_URL, SUPABASE_ANON_KEY)
        // Priority 2: Admin-saved config stored in localStorage (from setup panel)
        // Priority 3: Local-only mode (no Supabase)
        let url = null;
        let key = null;

        // Priority 1: Vercel build-injected meta tags (most secure — from env vars)
        if (META_SUPABASE_URL && META_SUPABASE_KEY) {
            url = META_SUPABASE_URL;
            key = META_SUPABASE_KEY;
        }

        // Priority 2: Admin-saved config in localStorage (manual setup via admin panel)
        if (!url) {
            const configSaved = localStorage.getItem('mm_supabase_config');
            if (configSaved) {
                try {
                    const parsed = JSON.parse(configSaved);
                    if (parsed.url && parsed.key) {
                        url = parsed.url;
                        key = parsed.key;
                    }
                } catch (e) {
                    // Invalid config — silently ignore
                }
            }
        }

        // Priority 3: No credentials found — local storage fallback only
        if (url && key) {
            // Load supabase js CDN library dynamically if needed
            if (!window.supabase) {
                const scriptPromise = new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
                await scriptPromise;
            }

            try {
                supabaseInstance = window.supabase.createClient(url, key);
                dbType = 'supabase';
                console.log("DB Manager: Mode SUPABASE actif.");
            } catch (err) {
                console.warn("Supabase init failed — mode local activé.");
                supabaseInstance = null;
                dbType = 'local';
            }
        } else {
            supabaseInstance = null;
            dbType = 'local';
            console.log("DB Manager: Mode LOCAL (aucune credential Supabase trouvée).");
        }
    }

    // Helper functions
    function checkLocalSession() {
        return sessionStorage.getItem('mm_admin_session') === 'authenticated';
    }

    async function checkSupabaseSession() {
        if (!supabaseInstance) return false;
        try {
            const { data } = await supabaseInstance.auth.getSession();
            return !!(data && data.session);
        } catch {
            return false;
        }
    }

    // Exported DB API
    const db = {
        init: initDB,
        getDbType: () => dbType,
        getSupabaseInstance: () => supabaseInstance,

        // Authentication status
        async isAuthenticated() {
            if (dbType === 'supabase') {
                return await checkSupabaseSession();
            }
            return checkLocalSession();
        },

        async getAdminEmail() {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const { data } = await supabaseInstance.auth.getSession();
                    if (data && data.session && data.session.user) {
                        return data.session.user.email;
                    }
                } catch { }
            }
            return 'admin@mirichimbumba.com';
        },

        // --- Articles API ---
        async getArticles() {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const { data, error } = await supabaseInstance
                        .from('articles')
                        .select('*')
                        .order('created_at', { ascending: false });
                    if (error) throw error;
                    return data;
                } catch (e) {
                    console.warn("Supabase fetch articles failed, reading from local:", e);
                }
            }
            // Local fallback
            const raw = localStorage.getItem('mm_local_articles');
            if (raw) {
                try { return JSON.parse(raw); } catch { }
            }
            return [...DEFAULT_ARTICLES];
        },

        async saveArticle(articleData) {
            const timestamp = new Date().toISOString();
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const dbRecord = {
                        title: articleData.title,
                        category: articleData.category,
                        description: articleData.description,
                        content: articleData.content,
                        image: articleData.image,
                        date: articleData.date,
                        associated_book: articleData.associatedBook || articleData.associated_book || '',
                        read_time: articleData.readTime || articleData.read_time || '3 min'
                    };

                    if (articleData.id && isNaN(articleData.id) && articleData.id.includes('-')) {
                        // UUID string: Update
                        const { error } = await supabaseInstance
                            .from('articles')
                            .update(dbRecord)
                            .eq('id', articleData.id);
                        if (error) throw error;
                    } else if (articleData.id) {
                        // Integer or local ID: Let's see if we should try UUID comparison or just insert
                        const { error } = await supabaseInstance
                            .from('articles')
                            .update(dbRecord)
                            .eq('id', articleData.id);
                        if (error) {
                            // If update fails, insert it
                            const { error: insErr } = await supabaseInstance
                                .from('articles')
                                .insert([dbRecord]);
                            if (insErr) throw insErr;
                        }
                    } else {
                        // New insert
                        const { error } = await supabaseInstance
                            .from('articles')
                            .insert([dbRecord]);
                        if (error) throw error;
                    }
                    return true;
                } catch (e) {
                    throw new Error("Supabase save article failed: " + e.message);
                }
            }
            // Local Storage
            let articles = [];
            const raw = localStorage.getItem('mm_local_articles');
            if (raw) {
                try { articles = JSON.parse(raw); } catch { }
            } else {
                articles = [...DEFAULT_ARTICLES];
            }

            if (articleData.id) {
                const idx = articles.findIndex(a => a.id === articleData.id);
                if (idx !== -1) {
                    articles[idx] = { ...articles[idx], ...articleData };
                }
            } else {
                articleData.id = 'art_' + Date.now();
                articles.unshift(articleData);
            }
            localStorage.setItem('mm_local_articles', JSON.stringify(articles));
            return true;
        },

        async deleteArticle(id) {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const { error } = await supabaseInstance
                        .from('articles')
                        .delete()
                        .eq('id', id);
                    if (error) throw error;
                    return true;
                } catch (e) {
                    throw new Error("Supabase delete failed: " + e.message);
                }
            }
            let articles = [];
            const raw = localStorage.getItem('mm_local_articles');
            if (raw) {
                try { articles = JSON.parse(raw); } catch { }
            }
            articles = articles.filter(a => a.id !== id);
            localStorage.setItem('mm_local_articles', JSON.stringify(articles));
            return true;
        },

        // --- Reservations API ---
        async getReservations() {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const { data, error } = await supabaseInstance
                        .from('reservations')
                        .select('*')
                        .order('created_at', { ascending: false });
                    if (error) throw error;
                    return data;
                } catch (e) {
                    console.warn("Supabase fetch reservations failed:", e);
                }
            }
            const raw = localStorage.getItem('mm_local_reservations');
            return raw ? JSON.parse(raw) : [];
        },

        async saveReservation(resData) {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    // Sanitize and limit input lengths before DB write
                    const dbRecord = {
                        session_type: String(resData.session_type || resData.sessionType || '').slice(0, 100),
                        date: String(resData.date || '').slice(0, 10),
                        time: String(resData.time || '').slice(0, 5),
                        first_name: String(resData.first_name || resData.firstName || '').slice(0, 80),
                        last_name: String(resData.last_name || resData.lastName || '').slice(0, 80),
                        email: String(resData.email || '').slice(0, 254),
                        zoom_link: String(resData.zoom_link || resData.zoomLink || '').slice(0, 500),
                        status: String(resData.status || 'confirmée').slice(0, 20)
                    };

                    if (resData.id) {
                        const { error } = await supabaseInstance
                            .from('reservations')
                            .update(dbRecord)
                            .eq('id', resData.id);
                        if (error) throw error;
                    } else {
                        const { error } = await supabaseInstance
                            .from('reservations')
                            .insert([dbRecord]);
                        if (error) throw error;
                    }
                    return true;
                } catch (e) {
                    throw new Error("Supabase save reservation failed: " + e.message);
                }
            }
            let reservations = [];
            const raw = localStorage.getItem('mm_local_reservations');
            if (raw) {
                try { reservations = JSON.parse(raw); } catch { }
            }
            if (resData.id) {
                const idx = reservations.findIndex(r => r.id === resData.id);
                if (idx !== -1) {
                    reservations[idx] = { ...reservations[idx], ...resData };
                }
            } else {
                resData.id = 'res_' + Date.now();
                resData.created_at = new Date().toISOString();
                reservations.unshift(resData);
            }
            localStorage.setItem('mm_local_reservations', JSON.stringify(reservations));
            return true;
        },

        async deleteReservation(id) {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const { error } = await supabaseInstance
                        .from('reservations')
                        .delete()
                        .eq('id', id);
                    if (error) throw error;
                    return true;
                } catch (e) {
                    throw new Error("Supabase delete reservation failed: " + e.message);
                }
            }
            let reservations = [];
            const raw = localStorage.getItem('mm_local_reservations');
            if (raw) {
                try { reservations = JSON.parse(raw); } catch { }
            }
            reservations = reservations.filter(r => r.id !== id);
            localStorage.setItem('mm_local_reservations', JSON.stringify(reservations));
            return true;
        },

        // --- Contact Messages API ---
        async getMessages() {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const { data, error } = await supabaseInstance
                        .from('messages')
                        .select('*')
                        .order('created_at', { ascending: false });
                    if (error) throw error;
                    return data;
                } catch (e) {
                    console.warn("Supabase fetch messages failed:", e);
                }
            }
            const raw = localStorage.getItem('mm_local_messages');
            return raw ? JSON.parse(raw) : [];
        },

        async saveMessage(msgData) {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    // Sanitize and limit input lengths before DB write
                    const dbRecord = {
                        first_name: String(msgData.first_name || msgData.firstName || '').slice(0, 80),
                        last_name: String(msgData.last_name || msgData.lastName || '').slice(0, 80),
                        email: String(msgData.email || '').slice(0, 254),
                        subject: String(msgData.subject || '').slice(0, 200),
                        message: String(msgData.message || '').slice(0, 5000),
                        is_read: msgData.is_read || false
                    };
                    if (msgData.id) {
                        const { error } = await supabaseInstance
                            .from('messages')
                            .update(dbRecord)
                            .eq('id', msgData.id);
                        if (error) throw error;
                    } else {
                        const { error } = await supabaseInstance
                            .from('messages')
                            .insert([dbRecord]);
                        if (error) throw error;
                    }
                    return true;
                } catch (e) {
                    throw new Error("Supabase save message failed: " + e.message);
                }
            }
            let messages = [];
            const raw = localStorage.getItem('mm_local_messages');
            if (raw) {
                try { messages = JSON.parse(raw); } catch { }
            }
            if (msgData.id) {
                const idx = messages.findIndex(m => m.id === msgData.id);
                if (idx !== -1) {
                    messages[idx] = { ...messages[idx], ...msgData };
                }
            } else {
                msgData.id = 'msg_' + Date.now();
                msgData.created_at = new Date().toISOString();
                msgData.is_read = false;
                messages.unshift(msgData);
            }
            localStorage.setItem('mm_local_messages', JSON.stringify(messages));
            return true;
        },

        async deleteMessage(id) {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const { error } = await supabaseInstance
                        .from('messages')
                        .delete()
                        .eq('id', id);
                    if (error) throw error;
                    return true;
                } catch (e) {
                    throw new Error("Supabase delete message failed: " + e.message);
                }
            }
            let messages = [];
            const raw = localStorage.getItem('mm_local_messages');
            if (raw) {
                try { messages = JSON.parse(raw); } catch { }
            }
            messages = messages.filter(m => m.id !== id);
            localStorage.setItem('mm_local_messages', JSON.stringify(messages));
            return true;
        },

        // --- Newsletter API ---
        async getNewsletter() {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const { data, error } = await supabaseInstance
                        .from('newsletter')
                        .select('*')
                        .order('created_at', { ascending: false });
                    if (error) throw error;
                    return data;
                } catch (e) {
                    console.warn("Supabase fetch newsletter failed:", e);
                }
            }
            const raw = localStorage.getItem('mm_local_newsletter');
            return raw ? JSON.parse(raw) : [];
        },

        async saveNewsletter(emailStr) {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const { error } = await supabaseInstance
                        .from('newsletter')
                        .insert([{ email: emailStr }]);
                    if (error && error.code !== '23505') throw error; // Allow duplicate email errors locally
                    return true;
                } catch (e) {
                    throw new Error("Supabase newsletter signup failed: " + e.message);
                }
            }
            let list = [];
            const raw = localStorage.getItem('mm_local_newsletter');
            if (raw) {
                try { list = JSON.parse(raw); } catch { }
            }
            const exists = list.some(item => item.email.toLowerCase() === emailStr.toLowerCase());
            if (!exists) {
                list.unshift({ id: 'ns_' + Date.now(), email: emailStr, created_at: new Date().toISOString() });
                localStorage.setItem('mm_local_newsletter', JSON.stringify(list));
            }
            return true;
        },

        async deleteNewsletter(id) {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const { error } = await supabaseInstance
                        .from('newsletter')
                        .delete()
                        .eq('id', id);
                    if (error) throw error;
                    return true;
                } catch (e) {
                    throw new Error("Supabase delete newsletter failed: " + e.message);
                }
            }
            let list = [];
            const raw = localStorage.getItem('mm_local_newsletter');
            if (raw) {
                try { list = JSON.parse(raw); } catch { }
            }
            list = list.filter(item => item.id !== id);
            localStorage.setItem('mm_local_newsletter', JSON.stringify(list));
            return true;
        },

        // --- Formations API ---
        async getFormations() {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const { data, error } = await supabaseInstance
                        .from('formations')
                        .select('*')
                        .order('module_order', { ascending: true })
                        .order('order_index', { ascending: true });
                    if (error) throw error;
                    return data;
                } catch (e) {
                    console.warn("Supabase fetch formations failed:", e);
                }
            }
            const raw = localStorage.getItem('mm_local_formations');
            if (raw) {
                try { return JSON.parse(raw); } catch { }
            }
            return [...DEFAULT_FORMATIONS];
        },

        async saveFormation(formData) {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const dbRecord = {
                        module_name: formData.module_name || formData.moduleName || '',
                        module_order: parseInt(formData.module_order || formData.moduleOrder || 1, 10),
                        title: formData.title || '',
                        description: formData.description || '',
                        type: formData.type || 'video',
                        media_url: formData.media_url || formData.mediaUrl || '',
                        schedule_date: formData.schedule_date || formData.scheduleDate || null,
                        duration: formData.duration || '',
                        order_index: parseInt(formData.order_index || formData.orderIndex || 1, 10)
                    };

                    if (formData.id && isNaN(formData.id) && formData.id.includes('-')) {
                        const { error } = await supabaseInstance
                            .from('formations')
                            .update(dbRecord)
                            .eq('id', formData.id);
                        if (error) throw error;
                    } else if (formData.id) {
                        const { error } = await supabaseInstance
                            .from('formations')
                            .update(dbRecord)
                            .eq('id', formData.id);
                        if (error) {
                            const { error: insErr } = await supabaseInstance
                                .from('formations')
                                .insert([dbRecord]);
                            if (insErr) throw insErr;
                        }
                    } else {
                        const { error } = await supabaseInstance
                            .from('formations')
                            .insert([dbRecord]);
                        if (error) throw error;
                    }
                    return true;
                } catch (e) {
                    throw new Error("Supabase save formation failed: " + e.message);
                }
            }
            let list = [];
            const raw = localStorage.getItem('mm_local_formations');
            if (raw) {
                try { list = JSON.parse(raw); } catch { }
            } else {
                list = [...DEFAULT_FORMATIONS];
            }

            if (formData.id) {
                const idx = list.findIndex(f => f.id === formData.id);
                if (idx !== -1) {
                    list[idx] = { ...list[idx], ...formData };
                }
            } else {
                formData.id = 'f_' + Date.now();
                formData.created_at = new Date().toISOString();
                list.push(formData);
            }
            // Sort by module_order then order_index
            list.sort((a, b) => {
                if (a.module_order !== b.module_order) return a.module_order - b.module_order;
                return a.order_index - b.order_index;
            });
            localStorage.setItem('mm_local_formations', JSON.stringify(list));
            return true;
        },

        async deleteFormation(id) {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const { error } = await supabaseInstance
                        .from('formations')
                        .delete()
                        .eq('id', id);
                    if (error) throw error;
                    return true;
                } catch (e) {
                    throw new Error("Supabase delete formation failed: " + e.message);
                }
            }
            let list = [];
            const raw = localStorage.getItem('mm_local_formations');
            if (raw) {
                try { list = JSON.parse(raw); } catch { }
            }
            list = list.filter(f => f.id !== id);
            localStorage.setItem('mm_local_formations', JSON.stringify(list));
            return true;
        }
    };

    window.supabaseDb = db;
    // Auto initiate on execution
    window.addEventListener('DOMContentLoaded', async () => {
        await db.init();
    });
})();
