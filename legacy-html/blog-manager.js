/**
 * Blog Manager for Mirichi Mbumba Site
 * Supports:
 * 1. Automatic loading of articles (local mock storage or remote Supabase)
 * 2. Visual layout injection on tribunes.html and article.html
 * 3. Client-side login modal for administrative actions
 * 4. Rich visual Add/Edit/Delete dashboard controls
 * 5. High-quality client-side canvas image resizing to base64 (saves storage setup)
 * 6. Quick browser-based Supabase installation panel
 */

(function () {
    // --- Constants and Default Configuration ---
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

    // Global state variables
    let dbType = 'local'; // 'local' or 'supabase'
    let supabaseInstance = null;
    let articles = [];
    let userSession = null;

    // --- Initialize Database & Settings ---
    function initDB() {
        const savedConfig = localStorage.getItem('mm_supabase_config');
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                if (config.url && config.key) {
                    dbType = 'supabase';
                    if (window.supabase) {
                        supabaseInstance = window.supabase.createClient(config.url, config.key);
                    }
                }
            } catch (e) {
                console.error("Invalid database config loaded", e);
            }
        }

        // Attempt local session check
        if (dbType === 'supabase') {
            checkSupabaseSession();
        } else {
            checkLocalSession();
        }
    }

    function saveSupabaseConfig(url, key) {
        if (url && key) {
            localStorage.setItem('mm_supabase_config', JSON.stringify({ url, key }));
            dbType = 'supabase';
            if (window.supabase) {
                supabaseInstance = window.supabase.createClient(url, key);
            }
            return true;
        } else {
            localStorage.removeItem('mm_supabase_config');
            dbType = 'local';
            supabaseInstance = null;
            return false;
        }
    }

    function getLocalPassword() {
        return localStorage.getItem('mm_admin_password') || 'mirichi2026';
    }

    function setLocalPassword(newPass) {
        if (newPass) {
            localStorage.setItem('mm_admin_password', newPass);
        }
    }

    // --- Session Checks ---
    async function checkSupabaseSession() {
        if (!supabaseInstance) return;
        try {
            const { data, error } = await supabaseInstance.auth.getSession();
            if (data && data.session) {
                userSession = data.session;
            } else {
                userSession = null;
            }
        } catch (e) {
            console.error(e);
            userSession = null;
        }
        updateAdminUI();
    }

    function checkLocalSession() {
        const sessionToken = sessionStorage.getItem('mm_admin_session');
        if (sessionToken === 'authenticated') {
            userSession = { user: { email: 'admin@mirichimbumba.com' } };
        } else {
            userSession = null;
        }
        updateAdminUI();
    }

    // --- Fetching Articles ---
    async function fetchArticles() {
        if (dbType === 'supabase' && supabaseInstance) {
            try {
                const { data, error } = await supabaseInstance
                    .from('articles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Map database naming scheme to app scheme
                articles = data.map(item => ({
                    id: item.id,
                    title: item.title,
                    category: item.category,
                    description: item.description,
                    content: item.content,
                    image: item.image,
                    date: item.date,
                    associatedBook: item.associated_book || item.associatedBook || '',
                    readTime: item.read_time || item.readTime || '2 min'
                }));

                // Merge in defaults if table is empty
                if (articles.length === 0) {
                    articles = [...DEFAULT_ARTICLES];
                }
            } catch (e) {
                console.error("Supabase failed, falling back to local storage:", e);
                loadLocalArticles();
            }
        } else {
            loadLocalArticles();
        }
    }

    function loadLocalArticles() {
        const raw = localStorage.getItem('mm_local_articles');
        if (raw) {
            try {
                articles = JSON.parse(raw);
            } catch (e) {
                articles = [...DEFAULT_ARTICLES];
            }
        } else {
            articles = [...DEFAULT_ARTICLES];
        }
    }

    function saveLocalArticles() {
        localStorage.setItem('mm_local_articles', JSON.stringify(articles));
    }

    // --- Writing / Deleting Articles ---
    async function saveArticle(articleData) {
        const id = articleData.id || ('art_' + Date.now());
        const timestamp = new Date().toISOString();

        // Format dynamic date
        const d = new Date(articleData.date || Date.now());
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const dateFormatted = d.toLocaleDateString('fr-FR', options);

        const record = {
            title: articleData.title,
            category: articleData.category,
            description: articleData.description,
            content: articleData.content,
            image: articleData.image || 'images/banniere livre.jpeg',
            date: dateFormatted,
            associatedBook: articleData.associatedBook || '',
            readTime: articleData.readTime || '3 min'
        };

        if (dbType === 'supabase' && supabaseInstance) {
            try {
                const dbRecord = {
                    title: record.title,
                    category: record.category,
                    description: record.description,
                    content: record.content,
                    image: record.image,
                    date: record.date,
                    associated_book: record.associatedBook,
                    read_time: record.readTime
                };

                if (articleData.id) {
                    // Update
                    const { error } = await supabaseInstance
                        .from('articles')
                        .update(dbRecord)
                        .eq('id', articleData.id);
                    if (error) throw error;
                } else {
                    // Insert
                    const { error } = await supabaseInstance
                        .from('articles')
                        .insert([dbRecord]);
                    if (error) throw error;
                }
            } catch (e) {
                alert("Erreur lors de la sauvegarde sur Supabase: " + e.message);
                return false;
            }
        } else {
            // Local Database update
            if (articleData.id) {
                const idx = articles.findIndex(a => a.id === articleData.id);
                if (idx !== -1) {
                    articles[idx] = { ...articles[idx], ...record };
                }
            } else {
                articles.unshift({ id, ...record });
            }
            saveLocalArticles();
        }

        await fetchArticles();
        renderTribunesPage();
        return true;
    }

    async function deleteArticle(id) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
            if (dbType === 'supabase' && supabaseInstance) {
                try {
                    const { error } = await supabaseInstance
                        .from('articles')
                        .delete()
                        .eq('id', id);
                    if (error) throw error;
                } catch (e) {
                    alert("Erreur Supabase: " + e.message);
                    return false;
                }
            } else {
                articles = articles.filter(a => a.id !== id);
                saveLocalArticles();
            }
            await fetchArticles();
            renderTribunesPage();

            // If we are on the article page, redirect to tribunes list
            if (window.location.pathname.includes('article')) {
                window.location.href = window.location.pathname.includes('legacy-html') ? 'tribunes.html' : 'tribunes';
            }
            return true;
        }
        return false;
    }

    // --- Canvas Image Resizing Helper ---
    function resizeImageBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxWidth = 800;
                    const maxHeight = 600;

                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Get highly compressed JPEG
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
                    resolve(compressedDataUrl);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    }

    // --- Authenticators ---
    async function performLogin(email, password) {
        if (dbType === 'supabase' && supabaseInstance) {
            try {
                const { data, error } = await supabaseInstance.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                userSession = data.session;
                updateAdminUI();
                return true;
            } catch (e) {
                alert("Erreur de connexion Supabase : " + e.message);
                return false;
            }
        } else {
            // Local Auth
            const correctEmail = 'admin@mirichimbumba.com';
            const correctPass = getLocalPassword();
            if (email === correctEmail && password === correctPass) {
                sessionStorage.setItem('mm_admin_session', 'authenticated');
                userSession = { user: { email: correctEmail } };
                updateAdminUI();
                return true;
            } else {
                alert("Identifiants locaux incorrects. Par défaut: admin@mirichimbumba.com / mirichi2026");
                return false;
            }
        }
    }

    function logout() {
        if (dbType === 'supabase' && supabaseInstance) {
            supabaseInstance.auth.signOut();
        }
        sessionStorage.removeItem('mm_admin_session');
        userSession = null;
        updateAdminUI();
        renderTribunesPage();
        // reload if on article detail page to hide edit bars
        if (window.location.pathname.includes('article')) {
            window.location.reload();
        }
    }

    // --- Dynamic Layout Rendering ---
    function renderTribunesPage() {
        const listContainer = document.getElementById('articles-list-container');
        if (!listContainer) return;

        // Filter out DEFAULT_ARTICLES if they are duplicate or if list is empty, let it run
        // Clear list
        listContainer.innerHTML = '';

        // Create the articles grids
        if (articles.length === 0) {
            listContainer.innerHTML = '<p class="text-center py-10" style="color:var(--muted)">Aucun article publié pour le moment.</p>';
            return;
        }

        articles.forEach((art, index) => {
            const card = document.createElement('article');
            card.className = 'card-dark p-8 reveal visible';
            card.style.position = 'relative';

            // Admin control tools inside card if logged in
            let adminToolsHTML = '';
            if (userSession) {
                adminToolsHTML = `
          <div class="flex items-center gap-3 absolute top-6 right-6 z-10">
            <button class="bg-[#1e1a3a] border border-[rgba(196,146,42,0.3)] hover:border-[var(--gold)] text-amber-100 hover:text-white px-3 py-1 text-xs" style="font-size: 0.7rem; transition: 0.25s;" onclick="window.mmOpenEditForm('${art.id}')">
              Modifier
            </button>
            <button class="bg-red-950 border border-red-800 hover:border-red-500 text-red-200 hover:text-white px-3 py-1 text-xs" style="font-size: 0.7rem; transition: 0.25s;" onclick="window.mmDeleteArticle('${art.id}')">
              Supprimer
            </button>
          </div>
        `;
            }

            card.innerHTML = `
        ${adminToolsHTML}
        <div class="flex flex-col md:flex-row gap-6">
          ${art.image ? `
            <div class="w-full md:w-48 h-32 overflow-hidden shrink-0 rounded" style="border: 1px solid rgba(196, 146, 42, 0.15);">
              <img src="${art.image}" alt="${art.title}" style="width:100%; height:100%; object-fit:cover;" />
            </div>
          ` : ''}
          <div class="flex-1">
            <p class="article-date">${art.category} · ${art.date}</p>
            <h2 style="font-family:'Cormorant Garant',serif;font-size:1.65rem;font-weight:400;margin-top:0.75rem;line-height:1.25">
              <a href="article.html?id=${art.id}" class="hover:text-[var(--gold-light)]">${art.title}</a>
            </h2>
            <p style="color:var(--muted);margin-top:0.75rem;line-height:1.8;font-size:0.95rem">${art.description || ''}</p>
            <a href="article.html?id=${art.id}" class="nav-link inline-block mt-4" style="padding:0;color:var(--gold)">Lire l'article →</a>
          </div>
        </div>
      `;

            listContainer.appendChild(card);
        });
    }

    function renderDetailPage() {
        const params = new URLSearchParams(window.location.search);
        const artId = params.get('id');
        if (!artId) return; // Fallback: keep static HTML contents intact for indexability

        // Find article
        const art = articles.find(a => a.id === artId);
        if (!art) {
            console.warn(`Article ID ${artId} was not found, showing default content instead.`);
            return;
        }

        // Populate metadata
        document.title = `${art.title} | Mirichi Mbumba`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', art.description || '');

        // Populate dynamic elements
        const mainNode = document.querySelector('article.section-main');
        if (mainNode) {
            let adminToolsHTML = '';
            if (userSession) {
                adminToolsHTML = `
          <div class="flex items-center gap-4 bg-[var(--dark-2)] border border-[rgba(196,146,42,0.18)] p-4 rounded mb-8 max-w-3xl mx-auto">
            <span class="text-xs text-[var(--gold-light)]">Contrôles administrateur :</span>
            <button class="bg-[#1e1a3a] border border-[rgba(196,146,42,0.3)] hover:border-[var(--gold)] text-amber-100 px-4 py-1.5 text-xs font-semibold rounded" onclick="window.mmOpenEditForm('${art.id}')">
              Modifier l'article
            </button>
            <button class="bg-red-950 border border-red-800 hover:border-red-500 text-red-200 px-4 py-1.5 text-xs font-semibold rounded" onclick="window.mmDeleteArticle('${art.id}')">
              Supprimer l'article
            </button>
          </div>
        `;
            }

            mainNode.innerHTML = `
        <div class="max-w-3xl mx-auto">
          ${adminToolsHTML}
          
          ${art.image ? `
            <div class="book-cover mb-8 reveal visible" style="border-radius:4px;overflow:hidden;max-height:360px">
              <img src="${art.image}" alt="${art.title}"
                style="width:100%;height:100%;object-fit:cover;min-height:220px;" loading="lazy" width="720" height="360" />
            </div>
          ` : ''}
          
          <p class="clinique-pill inline-block mb-4">${art.category}</p>
          <h1 style="font-family:'Cormorant Garant',serif;font-size:clamp(2rem,4vw,2.75rem);font-weight:400;line-height:1.15">${art.title}</h1>
          <p class="article-date">${art.date} · ${art.readTime || '3 min'} de lecture · Par Mirichi Mbumba</p>
          
          <div class="article-prose mt-10">
            ${art.content}
          </div>
          
          ${art.associatedBook ? `
            <div class="card-dark p-6 mt-12">
              <p class="section-label mb-2">Livre associé</p>
              <p style="font-family:'Cormorant Garant',serif;font-size:1.25rem">${art.associatedBook}</p>
              <a href="livre.html" class="btn-gold inline-block mt-4" style="padding:10px 18px;font-size:0.7rem">Découvrir le livre</a>
            </div>
          ` : ''}

          <div class="flex flex-wrap gap-3 mt-10" style="font-size:0.75rem;color:var(--muted)">
            <span>Partager :</span>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(art.title)}" target="_blank" class="clinique-pill">LinkedIn</a>
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(art.title)}&url=${encodeURIComponent(window.location.href)}" target="_blank" class="clinique-pill">X</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="clinique-pill">Facebook</a>
          </div>
          
          <div class="mt-12 p-8 text-center card-dark">
            <p class="section-label mb-2">Prochain pas</p>
            <a href="reservation.html" class="btn-gold inline-block" style="padding:12px 28px;font-size:0.75rem">Réserver une session de coaching</a>
          </div>
        </div>
      `;
        }
    }

    // --- Inject Admin UI Elements ---
    function updateAdminUI() {
        // 1. Inject administrative Topbar if logged in
        let barContainer = document.getElementById('admin-bar-container');
        if (!barContainer) {
            const mainShell = document.querySelector('main.page-shell');
            if (mainShell) {
                barContainer = document.createElement('div');
                barContainer.id = 'admin-bar-container';
                mainShell.insertBefore(barContainer, mainShell.firstChild);
            }
        }

        if (barContainer) {
            if (userSession) {
                barContainer.innerHTML = `
          <div style="background: linear-gradient(90deg, #100f22, #181630); border-bottom: 2px solid var(--gold); padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; font-family:'DM Sans', sans-serif;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display:-moz-inline-box; width: 10px; height: 10px; border-radius: 50%; background: #22c55e;"></span>
              <span style="font-size: 0.85rem; color: #fff; font-weight: 500;">Admin : <strong>${userSession.user.email}</strong> (<span style="color:var(--gold-light);">${dbType.toUpperCase()} mode</span>)</span>
            </div>
            <div style="display: flex; gap: 10px;">
              <button onclick="window.mmOpenEditForm()" class="btn-gold" style="padding: 8px 16px; font-size: 0.65rem; letter-spacing: 0.05em; border-radius:3px;">+ Nouvel Article</button>
              <button onclick="window.mmOpenSettings()" class="btn-outline" style="padding: 7px 16px; font-size: 0.65rem; letter-spacing: 0.05em;">Configuration Setup</button>
              <button onclick="window.mmLogout()" style="background:transparent; border:1px solid rgba(220, 38, 38, 0.5); color: #f87171; padding: 7px 16px; font-size: 0.65rem; letter-spacing: 0.05em; cursor:pointer;" onmouseover="this.style.borderColor='red';this.style.color='#ff3333'" onmouseout="this.style.borderColor='rgba(220, 38, 38, 0.5)';this.style.color='#f87171'">Déconnexion</button>
            </div>
          </div>
        `;
            } else {
                // Not logged in
                barContainer.innerHTML = '';
            }
        }

        // 2. Inject Espace Admin login link in footer if it doesn't already exist
        const footerSocial = document.querySelector('.mm-footer-social');
        if (footerSocial && !document.getElementById('admin-login-link')) {
            const loginLink = document.createElement('a');
            loginLink.id = 'admin-login-link';
            loginLink.href = '#';
            loginLink.style.cssText = 'color: var(--muted); font-size: 0.72rem; text-decoration: none; margin-left: 12px; border: 1px solid rgba(196,146,42,0.15); padding: 4px 10px; border-radius: 4px; transition: all 0.3s;';
            loginLink.textContent = '🔒 Connexion Admin';
            loginLink.onmouseover = function () {
                this.style.color = 'var(--gold-light)';
                this.style.borderColor = 'var(--gold)';
            };
            loginLink.onmouseout = function () {
                this.style.color = 'var(--muted)';
                this.style.borderColor = 'rgba(196,146,42,0.15)';
            };
            loginLink.onclick = function (e) {
                e.preventDefault();
                window.mmOpenLoginModal();
            };

            const wrapDiv = document.createElement('div');
            wrapDiv.style.width = '100%';
            wrapDiv.style.marginTop = '10px';
            wrapDiv.appendChild(loginLink);
            footerSocial.parentNode.appendChild(wrapDiv);
        }
    }

    // --- Modal Injection & Dialog Handling ---
    function getModalContainer() {
        let container = document.getElementById('blog-modal-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'blog-modal-container';
            document.body.appendChild(container);
        }
        return container;
    }

    window.mmOpenLoginModal = function () {
        const container = getModalContainer();
        container.innerHTML = `
      <div id="blog-login-modal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div class="card-dark border-[rgba(196,146,42,0.25)] max-w-md w-full p-8 relative rounded-md text-left" style="background: var(--dark-2);">
          <button onclick="window.mmCloseModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white" style="background:none; border:none; font-size:1.25rem; cursor:pointer;">✕</button>
          
          <h3 class="text-2xl font-normal text-[var(--gold-light)] mb-2" style="font-family:'Cormorant Garant',serif;">Administrateur</h3>
          <p class="text-xs text-gray-400 mb-6 font-light">Connectez-vous pour ajouter ou modifier des articles sur Mirichi Mbumba Tribunes.</p>
          
          <form id="blog-login-form" class="space-y-4">
            <div>
              <label class="form-label">Email de l'administrateur</label>
              <input type="email" id="login-email" class="form-input rounded-sm" placeholder="ex: admin@mirichimbumba.com" required value="" />
            </div>
            <div>
              <label class="form-label">Mot de passe</label>
              <input type="password" id="login-password" class="form-input rounded-sm" placeholder="••••••••" required />
            </div>
            <div class="pt-2">
              <button type="submit" class="btn-gold w-full py-3 rounded text-center">Se Connecter</button>
            </div>
          </form>
          
          <div class="mt-6 border-t border-[rgba(196,146,42,0.12)] pt-4 text-center">
            <span style="font-size: 0.72rem; color: var(--muted);">Type de données actif : <strong>${dbType.toUpperCase()}</strong></span>
            <button onclick="window.mmOpenSettings()" class="block mx-auto mt-2 text-xs text-[var(--gold-light)] hover:underline" style="background:none; border:none; cursor:pointer;">⚙️ Configurer Supabase / Clés</button>
          </div>
        </div>
      </div>
    `;

        document.getElementById('blog-login-form').onsubmit = async function (e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-password').value;
            const success = await performLogin(email, pass);
            if (success) {
                window.mmCloseModal();
            }
        };
    };

    window.mmOpenEditForm = function (articleId = null) {
        const container = getModalContainer();
        const isEdit = !!articleId;
        const article = isEdit ? articles.find(a => a.id === articleId) : null;

        // Default values
        const titleVal = article ? (article.title || '') : '';
        const descVal = article ? (article.description || '') : '';
        const catVal = article ? (article.category || 'Foi & Business') : 'Foi & Business';
        const contentVal = article ? (article.content || '') : '';
        const dateVal = article ? new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const imageVal = article ? (article.image || '') : '';
        const bookVal = article ? (article.associatedBook || '') : '';
        const readVal = article ? (article.readTime || '3 min') : '3 min';

        container.innerHTML = `
      <div id="blog-edit-modal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
        <div class="card-dark border-[rgba(196,146,42,0.25)] max-w-3xl w-full p-8 relative rounded-md text-left my-8" style="background: var(--dark-2); max-height: 90vh; overflow-y: auto;">
          <button onclick="window.mmCloseModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white" style="background:none; border:none; font-size:1.25rem; cursor:pointer;">✕</button>
          
          <h3 class="text-2xl font-normal text-[var(--gold-light)] mb-6" style="font-family:'Cormorant Garant',serif;">
            ${isEdit ? 'Modifier la Tribune' : 'Rédiger une nouvelle Tribune'}
          </h3>
          
          <form id="blog-edit-form" class="space-y-5">
            <input type="hidden" id="edit-id" value="${articleId || ''}" />
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Titre de l'article</label>
                <input type="text" id="edit-title" class="form-input rounded-sm" placeholder="ex: L'Église et la formation..." required value="${titleVal.replace(/"/g, '&quot;')}" />
              </div>
              <div>
                <label class="form-label">Catégorie</label>
                <select id="edit-category" class="form-input rounded-sm" style="background-color: var(--dark-3);">
                  <option value="Foi & Business" ${catVal === 'Foi & Business' ? 'selected' : ''}>Foi & Business</option>
                  <option value="Entrepreneuriat" ${catVal === 'Entrepreneuriat' ? 'selected' : ''}>Entrepreneuriat</option>
                  <option value="Leadership" ${catVal === 'Leadership' ? 'selected' : ''}>Leadership</option>
                  <option value="Stratégie" ${catVal === 'Stratégie' ? 'selected' : ''}>Stratégie</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="form-label">Date de publication</label>
                <input type="date" id="edit-date" class="form-input rounded-sm" value="${dateVal}" required />
              </div>
              <div>
                <label class="form-label">Livre associé</label>
                <input type="text" id="edit-book" class="form-input rounded-sm" placeholder="ex: Chrepreneur" value="${bookVal}" />
              </div>
              <div>
                <label class="form-label">Temps de lecture</label>
                <input type="text" id="edit-readtime" class="form-input rounded-sm" placeholder="ex: 3 min" value="${readVal}" />
              </div>
            </div>

            <div>
              <label class="form-label">Description courte (affiche dans la liste)</label>
              <textarea id="edit-description" class="form-input rounded-sm h-20 placeholder:text-gray-600 resize-y" placeholder="Une description concise qui invite les lecteurs à parcourir..." required>${descVal}</textarea>
            </div>

            <div>
              <label class="form-label">Illustrer par une Image</label>
              <input type="file" id="edit-image-file" class="form-input rounded-sm mb-2" accept="image/*" />
              <input type="text" id="edit-image-url" class="form-input rounded-sm placeholder:text-gray-600" placeholder="... ou renseignez une adresse URL directe pour l'image" value="${imageVal.startsWith('data:') ? '(Image Locale Chargee)' : imageVal}" />
              <p class="text-[10px] text-gray-500 mt-1">Sélectionnez une image de votre ordinateur. Notre outil la compressera à la volée avant sauvegarde.</p>
            </div>

            <div>
              <label class="form-label">Corps de l'article (Supporte les balises de paragraphe HTML : &lt;p&gt;, &lt;h4&gt;, etc.)</label>
              <textarea id="edit-content" class="form-input rounded-sm h-64 placeholder:text-gray-600 resize-y font-mono text-xs" style="background:#090912;" placeholder="Rédigez le texte complet ici..." required>${contentVal}</textarea>
            </div>

            <div class="pt-4 flex justify-end gap-3">
              <button type="button" onclick="window.mmCloseModal()" class="btn-outline" style="padding:10px 24px; font-size:0.7rem;">Annuler</button>
              <button type="submit" class="btn-gold" style="padding:11px 32px; font-size:0.7rem;">Publier</button>
            </div>
          </form>
        </div>
      </div>
    `;

        // Handle image file uploads
        let base64ImageStr = article ? article.image : '';
        const fileSelector = document.getElementById('edit-image-file');
        const urlInput = document.getElementById('edit-image-url');

        fileSelector.addEventListener('change', async function (e) {
            if (e.target.files && e.target.files[0]) {
                try {
                    urlInput.value = "Traitement et compression...";
                    urlInput.disabled = true;
                    base64ImageStr = await resizeImageBase64(e.target.files[0]);
                    urlInput.value = "(Image Locale Compressée chargée)";
                } catch (err) {
                    alert("Erreur compression image : " + err.message);
                    urlInput.value = "";
                    urlInput.disabled = false;
                }
            }
        });

        document.getElementById('blog-edit-form').onsubmit = async function (e) {
            e.preventDefault();

            const payload = {
                id: document.getElementById('edit-id').value || null,
                title: document.getElementById('edit-title').value,
                category: document.getElementById('edit-category').value,
                date: document.getElementById('edit-date').value,
                associatedBook: document.getElementById('edit-book').value,
                readTime: document.getElementById('edit-readtime').value,
                description: document.getElementById('edit-description').value,
                content: document.getElementById('edit-content').value,
                image: urlInput.value.startsWith('http') ? urlInput.value : base64ImageStr
            };

            const success = await saveArticle(payload);
            if (success) {
                window.mmCloseModal();
                if (window.location.pathname.includes('article.html') && payload.id) {
                    // If we edited an article on the single page, reload the content
                    window.location.reload();
                }
            }
        };
    };

    window.mmOpenSettings = function () {
        const container = getModalContainer();
        const configRaw = localStorage.getItem('mm_supabase_config');
        let savedUrl = '';
        let savedKey = '';
        if (configRaw) {
            try {
                const p = JSON.parse(configRaw);
                savedUrl = p.url || '';
                savedKey = p.key || '';
            } catch (e) { }
        }

        container.innerHTML = `
      <div id="blog-settings-modal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div class="card-dark border-[rgba(196,146,42,0.25)] max-w-lg w-full p-8 relative rounded-md text-left" style="background: var(--dark-2);">
          <button onclick="window.mmCloseModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white" style="background:none; border:none; font-size:1.25rem; cursor:pointer;">✕</button>
          
          <h3 class="text-2xl font-normal text-[var(--gold-light)] mb-2" style="font-family:'Cormorant Garant',serif;">Installation de la Base de Données</h3>
          <p class="text-xs text-gray-400 mb-6 font-light">Passez d'un stockage navigateur local à une base de données collaborative Supabase en quelques clics.</p>
          
          <form id="blog-settings-form" class="space-y-4">
            <div>
              <label class="form-label">Supabase Project URL</label>
              <input type="url" id="settings-url" class="form-input rounded-sm" placeholder="https://yourproject.supabase.co" value="${savedUrl}" />
            </div>
            <div>
              <label class="form-label">Supabase Anon Key</label>
              <input type="password" id="settings-key" class="form-input rounded-sm" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." value="${savedKey}" />
            </div>
            
            <div style="font-size: 0.72rem; line-height: 1.5;" class="text-gray-400 border border-[rgba(196,146,42,0.12)] p-3 rounded">
              <span class="text-[var(--gold-light)] font-bold">Guide Rapide :</span>
              <ul class="list-decimal pl-4 mt-1 space-y-1">
                <li>Créez un projet sur <a href="https://supabase.com" target="_blank" class="text-[var(--gold)] hover:underline">supabase.com</a></li>
                <li>Créez une table nommée <code>articles</code></li>
                <li>Ajoutez les colonnes suivantes : 
                  <code class="text-gray-300">title(text)</code>, 
                  <code class="text-gray-300">category(text)</code>, 
                  <code class="text-gray-300">description(text)</code>, 
                  <code class="text-gray-300">content(text)</code>, 
                  <code class="text-gray-300">image(text)</code>, 
                  <code class="text-gray-300">date(text)</code>, 
                  <code class="text-gray-300">associated_book(text)</code>,
                  <code class="text-gray-300">read_time(text)</code>
                </li>
                <li>Activez l'authentification email / mot de passe dans Supabase Auth</li>
              </ul>
            </div>

            <div class="pt-2 flex justify-end gap-3">
              <button type="button" onclick="window.mmClearSettings()" class="bg-red-950 text-red-200 border border-red-800 px-4 py-2 text-xs hover:border-red-500 hover:text-white" style="cursor:pointer;">Réinitialiser (Local)</button>
              <button type="submit" class="btn-gold" style="padding:10px 24px; font-size:0.7rem;">Enregistrer et Connecter</button>
            </div>
          </form>
        </div>
      </div>
    `;

        document.getElementById('blog-settings-form').onsubmit = async function (e) {
            e.preventDefault();
            const url = document.getElementById('settings-url').value.trim();
            const key = document.getElementById('settings-key').value.trim();

            if (url && key) {
                saveSupabaseConfig(url, key);
                alert("Configuration enregistrée. Tentative de chargement en cours...");
                initDB();
                await fetchArticles();
                window.mmCloseModal();
                if (window.location.pathname.includes('tribunes')) {
                    renderTribunesPage();
                } else {
                    renderDetailPage();
                }
            } else {
                alert("Veuillez remplir les deux champs ou cliquer sur Réinitialiser.");
            }
        };
    };

    window.mmClearSettings = function () {
        if (confirm("Réinitialiser et retourner au stockage local ?")) {
            saveSupabaseConfig('', '');
            alert("Configuration réinitialisée au stockage local.");
            initDB();
            fetchArticles().then(() => {
                window.mmCloseModal();
                if (window.location.pathname.includes('tribunes')) {
                    renderTribunesPage();
                } else {
                    renderDetailPage();
                }
            });
        }
    };

    window.mmCloseModal = function () {
        const container = document.getElementById('blog-modal-container');
        if (container) {
            container.innerHTML = '';
        }
    };

    // --- Exposed global wrappers ---
    window.mmLogout = logout;
    window.mmDeleteArticle = async function (id) {
        await deleteArticle(id);
    };

    // --- Initialize on Startup ---
    async function startup() {
        // 1. Inject Supabase JS Library if configured but not yet loaded
        const hasConfig = localStorage.getItem('mm_supabase_config');
        if (hasConfig && !window.supabase) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.async = false;

            // Wait for it to load
            const scriptPromise = new Promise((resolve) => {
                script.onload = resolve;
            });
            document.head.appendChild(script);
            await scriptPromise;
        }

        // 2. Initialize
        initDB();
        await fetchArticles();

        // 3. Render page specific layout
        const path = window.location.pathname;
        if (path.includes('tribunes') || path.endsWith('/') || path.endsWith('/index.html') || path.endsWith('/index')) {
            renderTribunesPage();
        }

        if (path.includes('article')) {
            renderDetailPage();
        }

        updateAdminUI();
    }

    // Bind to DOM when loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startup);
    } else {
        startup();
    }
})();
