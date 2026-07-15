/**
 * Admin Dashboard Engine for Cabinet Mirichi Mbumba
 * Binds tabs, authentications, tables and CRUD setups on admin.html page.
 */

// Global State
let activeTab = 'overview';
let cachedBookings = [];
let cachedMessages = [];
let cachedNewsletter = [];
let cachedFormations = [];
let cachedArticles = [];

// Init Startup
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for db-client.js to setup window.supabaseDb
    if (window.supabaseDb) {
        await initAdminAuth();
    } else {
        setTimeout(async () => {
            if (window.supabaseDb) await initAdminAuth();
        }, 800);
    }

    // Bind forms
    document.getElementById('admin-login-form').onsubmit = handleLoginSubmit;
});

// Gating authentications
async function initAdminAuth() {
    const isAuthed = await window.supabaseDb.isAuthenticated();
    if (isAuthed) {
        document.getElementById('admin-auth-screen').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');

        // Show DB Status info
        const dbType = window.supabaseDb.getDbType();
        const infoNode = document.getElementById('dashboard-conn-info');
        if (infoNode) {
            if (dbType === 'supabase') {
                const email = await window.supabaseDb.getAdminEmail();
                infoNode.innerHTML = `DATABASE STATUS: <span class="badge-status active">SUPABASE ACTIF</span> (Connecté sous <strong>${email}</strong>)`;
            } else {
                infoNode.innerHTML = `DATABASE STATUS: <span class="badge-status pending">LOCAL STORAGE (MOCK)</span> — Vos modifications sont stockées dans le navigateur local sur cet ordinateur.`;
            }
        }

        // Load data
        await fetchAllData();
        switchTab(activeTab);
    } else {
        document.getElementById('admin-auth-screen').classList.remove('hidden');
        document.getElementById('admin-dashboard').classList.add('hidden');
    }
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const pass = document.getElementById('admin-password').value.trim();

    const dbType = window.supabaseDb.getDbType();
    const supInstance = window.supabaseDb.getSupabaseInstance();

    if (dbType === 'supabase' && supInstance) {
        try {
            const { data, error } = await supInstance.auth.signInWithPassword({
                email,
                password: pass
            });
            if (error) throw error;
            sessionStorage.setItem('mm_admin_session', 'authenticated');
            await initAdminAuth();
        } catch (err) {
            alert("Erreur de connexion Supabase administrative : " + err.message);
        }
    } else {
        // Local validation fallback
        const savedPass = localStorage.getItem('mm_admin_password') || 'mirichi2026';
        if (email === 'admin@mirichimbumba.com' && pass === savedPass) {
            sessionStorage.setItem('mm_admin_session', 'authenticated');
            await initAdminAuth();
        } else {
            alert("Identifiants incorrects. Vérifiez l'email et le mot de passe administrateur.");
        }
    }
}

async function logoutAdmin() {
    const dbType = window.supabaseDb.getDbType();
    const supInstance = window.supabaseDb.getSupabaseInstance();
    if (dbType === 'supabase' && supInstance) {
        await supInstance.auth.signOut();
    }
    sessionStorage.removeItem('mm_admin_session');
    window.location.reload();
}

// Fetch all database records
async function fetchAllData() {
    try {
        cachedBookings = await window.supabaseDb.getReservations();
        cachedMessages = await window.supabaseDb.getMessages();
        cachedNewsletter = await window.supabaseDb.getNewsletter();
        cachedFormations = await window.supabaseDb.getFormations();
        cachedArticles = await window.supabaseDb.getArticles();

        renderOverviewStats();
        renderBookings();
        renderContactAndNewsletter();
        renderFormations();
        renderArticlesTable();
    } catch (e) {
        console.error("Error fetching admin modules data:", e);
    }
}

// Tab Switching Routing
function switchTab(tabId) {
    activeTab = tabId;

    // Reset tabs classes
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Add/remove tabs active classes
    const activeBtn = document.getElementById('tab-' + tabId);
    if (activeBtn) activeBtn.classList.add('active');

    // Hide panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    // Show active panel
    const targetedPanel = document.getElementById('panel-' + tabId);
    if (targetedPanel) targetedPanel.classList.remove('hidden');
}
window.switchTab = switchTab;

// 1. Render Stats Overview
function renderOverviewStats() {
    document.getElementById('stat-bookings').textContent = cachedBookings.length;
    document.getElementById('stat-messages').textContent = cachedMessages.length;
    document.getElementById('stat-subs').textContent = cachedNewsletter.length;
    document.getElementById('stat-courses').textContent = cachedFormations.length;

    // Render recent bookings summary (limit 5)
    const bookingsList = document.getElementById('overview-bookings-list');
    bookingsList.innerHTML = '';
    const sliceBookings = cachedBookings.slice(0, 5);
    if (sliceBookings.length === 0) {
        bookingsList.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-gray-500">Aucune réservation pour le moment.</td></tr>';
    } else {
        sliceBookings.forEach(res => {
            const dateFmt = new Date(res.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
            let badgeClass = 'badge-status pending';
            if (res.status === 'confirmée') badgeClass = 'badge-status active';
            if (res.status === 'annulée') badgeClass = 'badge-status cancelled';

            bookingsList.innerHTML += `
               <tr class="border-b border-[rgba(196,146,42,0.06)]">
                 <td class="py-2">${dateFmt} à ${res.time}</td>
                 <td class="py-2 font-medium">${res.first_name} ${res.last_name}</td>
                 <td class="py-2 text-[var(--gold)]" style="font-size:0.75rem">${res.session_type}</td>
                 <td class="py-2"><span class="${badgeClass}" style="font-size:0.65rem">${res.status || 'confirmée'}</span></td>
               </tr>
            `;
        });
    }

    // Render recent messages summary (limit 5)
    const msgList = document.getElementById('overview-messages-list');
    msgList.innerHTML = '';
    const sliceMsg = cachedMessages.slice(0, 5);
    if (sliceMsg.length === 0) {
        msgList.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-gray-500">Aucun message de contact.</td></tr>';
    } else {
        sliceMsg.forEach(msg => {
            const dateFmt = new Date(msg.created_at || Date.now()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
            msgList.innerHTML += `
               <tr class="border-b border-[rgba(196,146,42,0.06)]">
                 <td class="py-2 text-gray-500">${dateFmt}</td>
                 <td class="py-2 font-medium">${msg.first_name || ''} ${msg.last_name || ''}</td>
                 <td class="py-2 italic">${msg.subject || 'Aucun objet'}</td>
                 <td class="py-2 text-right"><button onclick="switchTab('members')" class="text-[var(--gold)] hover:underline read-btn font-semibold">Consulter</button></td>
               </tr>
            `;
        });
    }
}

// 2. Booking Managers
function renderBookings() {
    const rows = document.getElementById('bookings-rows');
    const searchVal = document.getElementById('booking-search').value.toLowerCase().trim();
    rows.innerHTML = '';

    const filtered = cachedBookings.filter(res => {
        const fullname = `${res.first_name} ${res.last_name}`.toLowerCase();
        const email = (res.email || '').toLowerCase();
        const type = (res.session_type || '').toLowerCase();
        return fullname.includes(searchVal) || email.includes(searchVal) || type.includes(searchVal);
    });

    if (filtered.length === 0) {
        rows.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-500">Aucune réservation trouvée.</td></tr>';
        return;
    }

    filtered.forEach(res => {
        let badgeClass = 'badge-status pending';
        if (res.status === 'confirmée') badgeClass = 'badge-status active';
        if (res.status === 'annulée') badgeClass = 'badge-status cancelled';

        const zoomText = res.zoom_link || res.zoomLink ?
            `<a href="${res.zoom_link || res.zoomLink}" target="_blank" class="text-sky-400 font-semibold hover:underline truncate block max-w-[200px]">${res.zoom_link || res.zoomLink}</a>` :
            `<span class="text-gray-500 font-light italic">Non associé</span>`;

        rows.innerHTML += `
           <tr>
             <td class="font-semibold text-[var(--gold-light)]">${res.date} à ${res.time}</td>
             <td>${res.first_name} ${res.last_name}</td>
             <td><a href="mailto:${res.email}" class="hover:underline">${res.email}</a></td>
             <td class="text-gray-400" style="font-size:0.8rem">${res.session_type}</td>
             <td><span class="${badgeClass}">${res.status || 'confirmée'}</span></td>
             <td>${zoomText}</td>
             <td class="text-right">
               <div class="flex gap-2 justify-end">
                 <button onclick="openVisioModal('${res.id}')" class="bg-amber-950/60 border border-amber-800 text-[11px] text-amber-200 px-2.5 py-1 hover:border-amber-400 transition" title="Lien Zoom/Meet">Visio</button>
                 <button onclick="toggleBookingStatus('${res.id}', '${res.status}')" class="bg-slate-800 border border-slate-700 text-[11px] text-slate-200 px-2.5 py-1 hover:border-slate-500 transition">Statut</button>
                 <button onclick="deleteBookingConfirm('${res.id}')" class="bg-red-950 border border-red-900 text-[11px] text-red-200 px-2.5 py-1 hover:border-red-600 transition">Retirer</button>
               </div>
             </td>
           </tr>
        `;
    });
}

async function toggleBookingStatus(id, currentStatus) {
    const targetRes = cachedBookings.find(r => r.id === id);
    if (!targetRes) return;

    const nextStatus = currentStatus === 'annulée' ? 'confirmée' : 'annulée';
    targetRes.status = nextStatus;

    try {
        await window.supabaseDb.saveReservation(targetRes);
        await fetchAllData();
    } catch (e) {
        alert("Erreur lors de la modification du statut : " + e.message);
    }
}

async function deleteBookingConfirm(id) {
    if (confirm("Voulez-vous vraiment supprimer cet enregistrement de réservation ?")) {
        try {
            await window.supabaseDb.deleteReservation(id);
            await fetchAllData();
        } catch (e) {
            alert(e.message);
        }
    }
}

function openVisioModal(id) {
    const res = cachedBookings.find(r => r.id === id);
    if (!res) return;

    const root = document.getElementById('admin-modal-root');
    root.innerHTML = `
      <div id="visio-modal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div class="card-dark border-[rgba(196,146,42,0.25)] max-w-md w-full p-8 relative rounded-md text-left" style="background: var(--dark-2);">
          <button onclick="closeAdminModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white" style="background:none; border:none; font-size:1.25rem; cursor:pointer;">✕</button>
          
          <h3 class="text-xl font-normal text-[var(--gold-light)] mb-4" style="font-family:'Cormorant Garant',serif;">Lien de Conférence Visio</h3>
          <p class="text-xs text-gray-400 mb-6">Associez un lien de téléconférence (Zoom, Google Meet, Teams, etc.) pour la session de <strong>${res.first_name} ${res.last_name}</strong>.</p>
          
          <div class="space-y-4">
             <div>
                <label class="form-label">URL de la téléconférence</label>
                <input type="url" id="visio-url-input" class="form-input-admin" placeholder="https://zoom.us/j/..." value="${res.zoom_link || res.zoomLink || ''}">
             </div>
             
             <div class="pt-2 flex justify-end gap-3">
               <button onclick="closeAdminModal()" class="btn-outline py-2 px-4" style="font-size:0.7rem">Annuler</button>
               <button onclick="saveVisioLink('${res.id}')" class="btn-gold py-2 px-5" style="font-size:0.7rem">Enregistrer le lien</button>
             </div>
          </div>
        </div>
      </div>
    `;
}

async function saveVisioLink(id) {
    const res = cachedBookings.find(r => r.id === id);
    if (!res) return;

    const urlVal = document.getElementById('visio-url-input').value.trim();
    res.zoom_link = urlVal;
    res.zoomLink = urlVal; // safety mapping

    try {
        await window.supabaseDb.saveReservation(res);
        closeAdminModal();
        await fetchAllData();
    } catch (e) {
        alert("Erreur de sauvegarde visio: " + e.message);
    }
}

// 3. Contacts / Newsletters
function renderContactAndNewsletter() {
    // Render contact messages
    const cards = document.getElementById('messages-cards-container');
    cards.innerHTML = '';

    if (cachedMessages.length === 0) {
        cards.innerHTML = '<p class="text-center py-8 text-gray-500">Aucun message de contact dans la base.</p>';
    } else {
        cachedMessages.forEach(msg => {
            const date = new Date(msg.created_at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
            const isRead = typeof msg.is_read !== 'undefined' ? msg.is_read : false;

            cards.innerHTML += `
               <div class="admin-card p-6 ${isRead ? 'opacity-70' : 'border-amber-700/50 bg-amber-950/5'}" style="transition:0.3s">
                 <div class="flex items-center justify-between mb-2">
                   <div>
                     <span class="text-xs text-[var(--gold)] uppercase font-semibold tracking-wider">${msg.subject || 'Objet général'}</span>
                     <h4 class="text-base font-medium mt-1">${msg.first_name || ''} ${msg.last_name || ''} (<a href="mailto:${msg.email}" class="text-amber-200 hover:underline">${msg.email}</a>)</h4>
                   </div>
                   <span class="text-xs text-gray-500">${date}</span>
                 </div>
                 
                 <p class="text-sm font-light leading-relaxed my-4 text-gray-200 border-l border-[var(--gold-pale)] pl-3 whitespace-pre-wrap">${msg.message || ''}</p>
                 
                 <div class="flex items-center justify-between border-t border-[rgba(196,146,42,0.06)] pt-4 mt-4">
                   <span class="text-xs ${isRead ? 'text-gray-500' : 'text-amber-300 font-bold'}">${isRead ? '✓ Lu' : '● Nouveau / Non Lu'}</span>
                   <div class="flex gap-2">
                     <button onclick="toggleMessageRead('${msg.id}', ${isRead})" class="text-xs px-3 py-1 bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 rounded">${isRead ? 'Marquer Non Lu' : 'Marquer Lu'}</button>
                     <button onclick="deleteMessageConfirm('${msg.id}')" class="text-xs px-3 py-1 bg-red-950 border border-red-900 hover:border-red-600 text-red-200 rounded">Supprimer</button>
                   </div>
                 </div>
               </div>
            `;
        });
    }

    // Render Newsletter Signups list
    const newsletterContainer = document.getElementById('newsletter-list-container');
    newsletterContainer.innerHTML = '';

    if (cachedNewsletter.length === 0) {
        newsletterContainer.innerHTML = '<p class="text-center py-6 text-xs text-gray-500">Aucun abonné newsletter.</p>';
    } else {
        cachedNewsletter.forEach(sub => {
            const date = new Date(sub.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
            newsletterContainer.innerHTML += `
               <div class="flex items-center justify-between p-2 border-b border-[rgba(196,146,42,0.05)] text-xs">
                 <div class="truncate pr-2">
                   <p class="font-medium text-gray-200">${sub.email}</p>
                   <span class="text-[9px] text-gray-500">Inscrit le ${date}</span>
                 </div>
                 <button onclick="deleteNewsletterConfirm('${sub.id}')" class="text-red-400 hover:text-red-600 p-1 font-semibold" title="Rétracter">Retirer</button>
               </div>
            `;
        });
    }
}

async function toggleMessageRead(id, isRead) {
    const msg = cachedMessages.find(m => m.id === id);
    if (!msg) return;

    msg.is_read = !isRead;
    try {
        await window.supabaseDb.saveMessage(msg);
        await fetchAllData();
    } catch (e) {
        alert(e.message);
    }
}

async function deleteMessageConfirm(id) {
    if (confirm("Supprimer ce message définitivement ?")) {
        try {
            await window.supabaseDb.deleteMessage(id);
            await fetchAllData();
        } catch (e) {
            alert(e.message);
        }
    }
}

async function deleteNewsletterConfirm(id) {
    if (confirm("Retirer cet email de la liste d'abonnements newsletter ?")) {
        try {
            await window.supabaseDb.deleteNewsletter(id);
            await fetchAllData();
        } catch (e) {
            alert(e.message);
        }
    }
}

function exportNewsletterCSV() {
    if (cachedNewsletter.length === 0) {
        alert("Aucun e-mail d'abonnement newsletter à exporter.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,ID,Email,Date Inscription\n";
    cachedNewsletter.forEach(item => {
        const idStr = item.id.replace(/"/g, '""');
        const emailStr = item.email.replace(/"/g, '""');
        const dateStr = (item.created_at || '').replace(/"/g, '""');
        csvContent += `"${idStr}","${emailStr}","${dateStr}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsletter_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
window.exportNewsletterCSV = exportNewsletterCSV;

// 4. Formations Manager (Modules & Lessons CRUD)
function renderFormations() {
    const container = document.getElementById('formations-modules-container');
    container.innerHTML = '';

    if (cachedFormations.length === 0) {
        container.innerHTML = `
          <div class="text-center py-10 admin-card p-6">
            <span class="text-3xl">🎥</span>
            <p class="text-sm text-gray-400 mt-2">Aucun cours de formation publié pour le moment.</p>
          </div>
        `;
        return;
    }

    // Group courses by Module Name
    const modules = {};
    cachedFormations.forEach(course => {
        const key = course.module_name || 'Module sans titre';
        if (!modules[key]) {
            modules[key] = {
                order: course.module_order || 99,
                courses: []
            };
        }
        modules[key].courses.push(course);
    });

    // Sort modules by order key
    const sortedModuleNames = Object.keys(modules).sort((a, b) => modules[a].order - modules[b].order);

    sortedModuleNames.forEach(moduleName => {
        const mod = modules[moduleName];

        let moduleHtml = `
          <div class="admin-card p-6 space-y-4">
             <div class="border-b border-[rgba(196,146,42,0.15)] pb-3 flex justify-between items-center flex-wrap gap-2">
                 <div>
                    <span class="section-label">Module ${mod.order}</span>
                    <h3 class="text-xl font-normal text-amber-200 mt-1">${moduleName}</h3>
                 </div>
                 <span class="text-xs text-gray-500 font-medium">${mod.courses.length} cours</span>
             </div>
             
             <div class="space-y-3">
        `;

        // Sort course items by order_index
        mod.courses.sort((a, b) => (a.order_index || 1) - (b.order_index || 1));

        mod.courses.forEach(course => {
            let icon = '🎥';
            if (course.type === 'pdf') icon = '📄';
            if (course.type === 'live') icon = '📡';

            const liveBadge = course.type === 'live' && course.schedule_date ?
                `<span class="badge-status pending text-[9px] lowercase mr-2 font-normal">${new Date(course.schedule_date).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>` : '';

            moduleHtml += `
               <div style="background:rgba(255,255,255,0.01);" class="border border-[rgba(196,146,42,0.07)] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[rgba(196,146,42,0.25)] transition">
                  <div class="flex items-start gap-4">
                      <span class="text-xl shrink-0 p-1.5 bg-black/40 border border-amber-500/10 rounded">${icon}</span>
                      <div>
                         <div class="flex items-center flex-wrap gap-2">
                           <h4 class="font-semibold text-gray-100 text-sm">${course.title || 'Cours sans titre'}</h4>
                           <span class="text-[10px] text-[var(--gold)] bg-amber-500/5 px-2 py-0.5 border border-amber-500/15 uppercase font-medium font-mono">${course.duration || 'N/A'}</span>
                         </div>
                         <p class="text-xs text-gray-400 font-light mt-1 max-w-2xl">${course.description || ''}</p>
                         <div class="flex items-center gap-2 mt-2">
                           ${liveBadge}
                           <a href="${course.media_url || course.mediaUrl || '#'}" target="_blank" class="text-xs text-sky-400 font-medium hover:underline truncate max-w-[280px]">support: ${course.media_url || course.mediaUrl || 'Aucun lien'}</a>
                         </div>
                      </div>
                  </div>
                  
                  <div class="flex gap-2 justify-end shrink-0">
                    <button onclick="openFormationForm('${course.id}')" class="bg-amber-950/40 border border-amber-900/60 hover:border-amber-500 text-amber-200 text-xs px-3 py-1.5 transition">Modifier</button>
                    <button onclick="deleteFormationConfirm('${course.id}')" class="bg-red-950/60 border border-red-900 status-btn hover:border-red-500 text-red-200 text-xs px-3 py-1.5 transition">Supprimer</button>
                  </div>
               </div>
            `;
        });

        moduleHtml += `
             </div>
          </div>
        `;

        container.innerHTML += moduleHtml;
    });
}

function openFormationForm(courseId = null) {
    const isEdit = !!courseId;
    const course = isEdit ? cachedFormations.find(f => f.id === courseId) : null;

    // Setup inputs defaultValue
    const modNameVal = course ? (course.module_name || '') : '';
    const modOrderVal = course ? (course.module_order || 1) : 1;
    const titleVal = course ? (course.title || '') : '';
    const descVal = course ? (course.description || '') : '';
    const typeVal = course ? (course.type || 'video') : 'video';
    const mediaVal = course ? (course.media_url || course.mediaUrl || '') : '';
    const durationVal = course ? (course.duration || '15:00') : '15:00';
    const indexVal = course ? (course.order_index || 1) : 1;

    // Live date format setup
    let dateStr = '';
    if (course && course.schedule_date) {
        try {
            dateStr = new Date(course.schedule_date).toISOString().slice(0, 16);
        } catch (e) { }
    }

    const root = document.getElementById('admin-modal-root');
    root.innerHTML = `
       <div id="formation-editor-modal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
         <div class="card-dark border-[rgba(196,146,42,0.25)] max-w-2xl w-full p-8 relative rounded-md text-left my-8" style="background: var(--dark-2); max-height:85vh; overflow-y:auto;">
           <button onclick="closeAdminModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white" style="background:none; border:none; font-size:1.25rem; cursor:pointer;">✕</button>
           
           <h3 class="text-2xl font-normal text-[var(--gold-light)] mb-6" style="font-family:'Cormorant Garant',serif;">
              ${isEdit ? 'Modifier le cours' : 'Ajouter un cours dans la formation'}
           </h3>
           
           <form id="formation-crud-form" class="space-y-4">
              <input type="hidden" id="fc-id" value="${courseId || ''}">
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-2">
                  <label class="form-label">Nom du Module</label>
                  <input type="text" id="fc-modname" class="form-input-admin" placeholder="ex: Module 1 : Les Fondations Spirituelles" value="${modNameVal}" required>
                </div>
                <div>
                  <label class="form-label">Ordre du Module</label>
                  <input type="number" id="fc-modorder" class="form-input-admin" placeholder="ex: 1" value="${modOrderVal}" required>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-2">
                  <label class="form-label">Titre du Cours / Titre de la leçon</label>
                  <input type="text" id="fc-title" class="form-input-admin" placeholder="ex: 1.1 Introduction au Chrepreneuriat" value="${titleVal.replace(/"/g, '&quot;')}" required>
                </div>
                <div>
                  <label class="form-label">Type de Support</label>
                  <select id="fc-type" class="form-input-admin" style="background:#09090f" onchange="adjustFormFieldsVisibility()">
                     <option value="video" ${typeVal === 'video' ? 'selected' : ''}>🎥 Vidéo pédagogique</option>
                     <option value="pdf" ${typeVal === 'pdf' ? 'selected' : ''}>📄 Support de cours PDF</option>
                     <option value="live" ${typeVal === 'live' ? 'selected' : ''}>📡 Session Direct (Zoom / Meet)</option>
                  </select>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label class="form-label">Durée estimée / Nb Pages</label>
                   <input type="text" id="fc-duration" class="form-input-admin" placeholder="ex: 18:45 ou 24 pages" value="${durationVal}">
                 </div>
                 <div>
                   <label class="form-label">Index d'Ordre dans le Module</label>
                   <input type="number" id="fc-index" class="form-input-admin" placeholder="ex: 1, 2" value="${indexVal}" required>
                 </div>
              </div>
              
              <div>
                 <label class="form-label">URL du document / Lien de la visio / Vidéo YouTube</label>
                 <input type="url" id="fc-media" class="form-input-admin" placeholder="https://..." value="${mediaVal}" required>
                 <p class="text-[10px] text-gray-500 mt-1">Configurez le lien direct pour le PDF, la vidéo YouTube/Vimeo ou le lien de réunion Zoom.</p>
              </div>
              
              <div id="fc-time-group" class="hidden">
                 <label class="form-label">Programmation Date & Heure du Direct</label>
                 <input type="datetime-local" id="fc-schedule" class="form-input-admin" value="${dateStr}">
              </div>
              
              <div>
                 <label class="form-label">Description synthétique du cours</label>
                 <textarea id="fc-description" class="form-input-admin h-20 placeholder:text-gray-600 resize-y" placeholder="Décrivez succinctement les objectifs de cette session..." required>${descVal}</textarea>
              </div>
              
              <div class="pt-4 flex justify-end gap-3">
                 <button type="button" onclick="closeAdminModal()" class="btn-outline py-2 px-4" style="font-size:0.7rem">Annuler</button>
                 <button type="submit" class="btn-gold py-2 px-6" style="font-size:0.7rem">Enregistrer et Publier</button>
              </div>
           </form>
         </div>
       </div>
    `;

    adjustFormFieldsVisibility();
    document.getElementById('formation-crud-form').onsubmit = handleFormationSubmit;
}
window.openFormationForm = openFormationForm;

function adjustFormFieldsVisibility() {
    const selectType = document.getElementById('fc-type').value;
    const timeGroup = document.getElementById('fc-time-group');
    if (selectType === 'live') {
        timeGroup.classList.remove('hidden');
    } else {
        timeGroup.classList.add('hidden');
    }
}
window.adjustFormFieldsVisibility = adjustFormFieldsVisibility;

async function handleFormationSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('fc-id').value || null;
    const payload = {
        id,
        module_name: document.getElementById('fc-modname').value.trim(),
        module_order: parseInt(document.getElementById('fc-modorder').value || 1, 10),
        title: document.getElementById('fc-title').value.trim(),
        description: document.getElementById('fc-description').value.trim(),
        type: document.getElementById('fc-type').value,
        media_url: document.getElementById('fc-media').value.trim(),
        duration: document.getElementById('fc-duration').value.trim(),
        order_index: parseInt(document.getElementById('fc-index').value || 1, 10)
    };

    if (payload.type === 'live') {
        const schedNode = document.getElementById('fc-schedule').value;
        payload.schedule_date = schedNode ? new Date(schedNode).toISOString() : null;
    } else {
        payload.schedule_date = null;
    }

    try {
        await window.supabaseDb.saveFormation(payload);
        closeAdminModal();
        await fetchAllData();
    } catch (err) {
        alert("Erreur de sauvegarde de cours: " + err.message);
    }
}

async function deleteFormationConfirm(id) {
    if (confirm("Supprimer ce cours définitivement ?")) {
        try {
            await window.supabaseDb.deleteFormation(id);
            await fetchAllData();
        } catch (e) {
            alert(e.message);
        }
    }
}

// 5. Blog Tribunes CRUD
function renderArticlesTable() {
    const rows = document.getElementById('articles-rows');
    rows.innerHTML = '';

    if (cachedArticles.length === 0) {
        rows.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Aucun article dans la base d\'articles.</td></tr>';
        return;
    }

    cachedArticles.forEach(art => {
        let displayImg = art.image ?
            `<div class="w-12 h-12 overflow-hidden border border-amber-500/10"><img src="${art.image}" class="w-full h-full object-cover"></div>` :
            `<span class="text-xs text-gray-500">Aucune</span>`;

        rows.innerHTML += `
           <tr>
             <td>${displayImg}</td>
             <td>
               <span class="text-[10px] text-[var(--gold)] uppercase font-semibold">${art.category}</span>
               <p class="text-xs text-gray-500">${art.date || ''}</p>
             </td>
             <td class="font-medium text-gray-200">${art.title}</td>
             <td class="text-xs text-gray-400">
               <div>li: ${art.readTime || art.read_time || '3 min'}</div>
               <div style="font-size:0.65rem" class="text-amber-200 font-mono">${art.associatedBook || art.associated_book || ''}</div>
             </td>
             <td class="text-right">
               <div class="flex gap-2 justify-end">
                 <button onclick="openArticleEditor('${art.id}')" class="bg-amber-955 border border-amber-900 text-amber-200 text-xs px-2.5 py-1 hover:border-amber-500 transition">Modifier</button>
                 <button onclick="deleteArticleConfirm('${art.id}')" class="bg-red-955 border border-red-900 text-red-200 text-xs px-2.5 py-1 hover:border-red-500 transition">Supprimer</button>
               </div>
             </td>
           </tr>
        `;
    });
}

function openArticleEditor(artId = null) {
    const isEdit = !!artId;
    const art = isEdit ? cachedArticles.find(a => a.id === artId) : null;

    // Inputs defaults
    const titleVal = art ? (art.title || '') : '';
    const descVal = art ? (art.description || '') : '';
    const catVal = art ? (art.category || 'Foi & Business') : 'Foi & Business';
    const contentVal = art ? (art.content || '') : '';
    const dateVal = art ? new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const imageVal = art ? (art.image || '') : '';
    const bookVal = art ? (art.associatedBook || art.associated_book || '') : '';
    const readVal = art ? (art.readTime || art.read_time || '3 min') : '3 min';

    const root = document.getElementById('admin-modal-root');
    root.innerHTML = `
      <div id="art-editor-modal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
        <div class="card-dark border-[rgba(196,146,42,0.25)] max-w-3xl w-full p-8 relative rounded-md text-left my-8" style="background: var(--dark-2); max-height:85vh; overflow-y:auto;">
          <button onclick="closeAdminModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white" style="background:none; border:none; font-size:1.25rem; cursor:pointer;">✕</button>
          
          <h3 class="text-2xl font-normal text-[var(--gold-light)] mb-6" style="font-family:'Cormorant Garant',serif;">
            ${isEdit ? 'Modifier la Tribune' : 'Chronique d\'une Nouvelle Tribune'}
          </h3>
          
          <form id="art-editor-form" class="space-y-4">
            <input type="hidden" id="art-fc-id" value="${artId || ''}" />
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Titre de la tribune</label>
                <input type="text" id="art-fc-title" class="form-input-admin" placeholder="Le travail comme mission..." value="${titleVal.replace(/"/g, '&quot;')}" required />
              </div>
              <div>
                <label class="form-label">Catégorie</label>
                <select id="art-fc-category" class="form-input-admin" style="background-color: var(--dark-3);">
                  <option value="Foi & Business" ${catVal === 'Foi & Business' ? 'selected' : ''}>Foi & Business</option>
                  <option value="Entrepreneuriat" ${catVal === 'Entrepreneuriat' ? 'selected' : ''}>Entrepreneuriat</option>
                  <option value="Leadership" ${catVal === 'Leadership' ? 'selected' : ''}>Leadership</option>
                  <option value="Stratégie" ${catVal === 'Stratégie' ? 'selected' : ''}>Stratégie</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="form-label">Date (affichée)</label>
                <input type="date" id="art-fc-date" class="form-input-admin" value="${dateVal}" required />
              </div>
              <div>
                <label class="form-label">Livre Associé</label>
                <input type="text" id="art-fc-book" class="form-input-admin" placeholder="ex: Chrepreneur" value="${bookVal}" />
              </div>
              <div>
                <label class="form-label">Temps de lecture</label>
                <input type="text" id="art-fc-readtime" class="form-input-admin" placeholder="ex: 3 min" value="${readVal}" />
              </div>
            </div>

            <div>
              <label class="form-label">Brève Description (affichée en liste)</label>
              <textarea id="art-fc-description" class="form-input-admin h-20 resize-y" placeholder="Sommaire court de l'article" required>${descVal}</textarea>
            </div>

            <div>
              <label class="form-label">Image d'illustration commerciale</label>
              <input type="file" id="art-fc-file" class="form-input-admin mb-2" accept="image/*" />
              <input type="text" id="art-fc-imageurl" class="form-input-admin" placeholder="Ou URL absolue de l'image" value="${imageVal.startsWith('data:') ? '(Image Locale Chargee)' : imageVal}" />
            </div>

            <div>
              <label class="form-label">Corps de l'Article (HTML admis: &lt;p&gt;, &lt;h4&gt;, &lt;div class="pull-quote"&gt;)</label>
              <textarea id="art-fc-content" class="form-input-admin h-48 font-mono text-xs resize-y" style="background:#090912;" placeholder="<p>Corps de la tribune...</p>" required>${contentVal}</textarea>
            </div>

            <div class="pt-4 flex justify-end gap-3">
              <button type="button" onclick="closeAdminModal()" class="btn-outline py-2 px-4" style="font-size:0.7rem">Annuler</button>
              <button type="submit" class="btn-gold py-2 px-6" style="font-size:0.7rem">Publier l'Article</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Canvas resizing setup
    let compressedImgStr = art ? art.image : '';
    const fileSel = document.getElementById('art-fc-file');
    const urlInput = document.getElementById('art-fc-imageurl');

    fileSel.addEventListener('change', async function (e) {
        if (e.target.files && e.target.files[0]) {
            try {
                urlInput.value = "Compression et traitement...";
                urlInput.disabled = true;
                compressedImgStr = await resizeImageBase64(e.target.files[0]);
                urlInput.value = "(Image locale chargée et optimisée)";
            } catch (err) {
                alert("Erreur lors de la compression de l'image.");
                urlInput.value = "";
                urlInput.disabled = false;
            }
        }
    });

    document.getElementById('art-editor-form').onsubmit = handleArticleSubmit;
}
window.openArticleEditor = openArticleEditor;

async function handleArticleSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('art-fc-id').value || null;
    const urlInput = document.getElementById('art-fc-imageurl').value;

    // Format date beautifully
    const inputDate = document.getElementById('art-fc-date').value;
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const dateFormatted = new Date(inputDate).toLocaleDateString('fr-FR', options);

    let base64ImageVal = '';
    // Determine image source
    if (urlInput.startsWith('http') || urlInput.startsWith('/')) {
        base64ImageVal = urlInput;
    } else {
        const foundArt = cachedArticles.find(a => a.id === id);
        // Find existing image or compile compressed string
        base64ImageVal = urlInput === "(Image locale chargée et optimisée)" ? window.adminCompressedImage : (foundArt ? foundArt.image : '');
    }

    const payload = {
        id,
        title: document.getElementById('art-fc-title').value.trim(),
        category: document.getElementById('art-fc-category').value,
        date: dateFormatted,
        associatedBook: document.getElementById('art-fc-book').value.trim(),
        readTime: document.getElementById('art-fc-readtime').value.trim(),
        description: document.getElementById('art-fc-description').value.trim(),
        content: document.getElementById('art-fc-content').value.trim(),
        image: base64ImageVal
    };

    try {
        await window.supabaseDb.saveArticle(payload);
        closeAdminModal();
        await fetchAllData();
    } catch (err) {
        alert("Erreur de sauvegarde article: " + err.message);
    }
}

async function deleteArticleConfirm(id) {
    if (confirm("Voulez-vous supprimer cette tribune ?")) {
        try {
            await window.supabaseDb.deleteArticle(id);
            await fetchAllData();
        } catch (e) {
            alert(e.message);
        }
    }
}

// Global modal utilities
function closeAdminModal() {
    const root = document.getElementById('admin-modal-root');
    if (root) root.innerHTML = '';
}
window.closeAdminModal = closeAdminModal;
