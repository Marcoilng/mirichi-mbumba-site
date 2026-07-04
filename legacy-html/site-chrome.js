/**
 * Chrome partagé (nav, menu mobile, overlay « Menu », panier, footer).
 * Chaque page : placer <div id="mm-nav-root"></div> en haut du body,
 * <div id="mm-footer-root"></div> avant les scripts, <div id="mm-cart-root"></div> après le footer,
 * puis charger ce fichier AVANT _shared.js.
 */
(function () {
  var NAV =
    '<nav id="navbar" class="py-5 px-6 lg:px-12">' +
    '<div class="max-w-7xl mx-auto flex items-center justify-between gap-4">' +
    '<a href="index.html" class="flex items-center gap-3 shrink-0">' +
    '<div class="w-8 h-8 border flex items-center justify-center" style="border-color:var(--gold)">' +
    '<span style="font-family:\'Cormorant Garant\',serif;color:var(--gold);font-size:1rem;font-weight:600;">M</span></div>' +
    '<span class="hidden sm:inline" style="font-family:\'Cormorant Garant\',serif;font-size:1.05rem;letter-spacing:0.05em;font-weight:500;">Mirichi Mbumba</span></a>' +
    '<div class="desktop-nav flex items-center gap-5 xl:gap-6">' +
    '<a href="about.html" class="nav-link">À propos</a>' +
    '<a href="foi-valeurs.html" class="nav-link">Foi &amp; Valeurs</a>' +
    '<a href="shop.html" class="nav-link">Shop</a>' +
    '<a href="tribunes.html" class="nav-link">Tribunes</a>' +
    '<a href="coaching.html" class="nav-link">Coaching</a>' +
    '<a href="clinique.html" class="nav-link">La Clinique</a>' +
    '<a href="temoignages.html" class="nav-link">Témoignages</a>' +
    '<a href="contact.html" class="nav-link">Contact</a></div>' +
    '<div class="flex items-center gap-2 sm:gap-3 shrink-0">' +
    '<button type="button" onclick="toggleCart()" class="relative p-2" aria-label="Panier">' +
    '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="color:var(--muted)"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>' +
    '<span class="cart-badge" id="cart-count">0</span></button>' +
    '<button type="button" class="hidden lg:inline-flex btn-outline" style="padding:9px 14px;font-size:0.65rem" onclick="openSiteMenu()">Menu</button>' +
    '<a href="reservation.html" class="btn-gold hidden md:inline-block" style="padding:10px 18px;font-size:0.68rem">Réserver</a>' +
    '<button type="button" id="menu-btn" class="lg:hidden flex flex-col gap-1.5 p-2" onclick="toggleMenu()" aria-label="Ouvrir le menu">' +
    '<span class="w-6 h-px bg-white block transition-all" id="bar1"></span>' +
    '<span class="w-6 h-px bg-white block transition-all" id="bar2"></span>' +
    '<span class="w-6 h-px bg-white block transition-all" id="bar3"></span></button></div></div></nav>';

  var MOBILE =
    '<div id="mobile-menu" class="fixed inset-0 flex flex-col justify-center px-8 lg:hidden" style="background:var(--dark-2);z-index:90">' +
    '<div class="flex flex-col gap-6">' +
    '<a href="index.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:2.25rem;font-weight:300;color:var(--white)">Accueil</a>' +
    '<a href="about.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:2.25rem;font-weight:300;color:var(--white)">À propos</a>' +
    '<a href="foi-valeurs.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:2.25rem;font-weight:300;color:var(--white)">Foi &amp; Valeurs</a>' +
    '<a href="shop.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:2.25rem;font-weight:300;color:var(--white)">Shop</a>' +
    '<a href="tribunes.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:2.25rem;font-weight:300;color:var(--white)">Tribunes</a>' +
    '<a href="coaching.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:2.25rem;font-weight:300;color:var(--white)">Coaching</a>' +
    '<a href="clinique.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:2.25rem;font-weight:300;color:var(--white)">La Clinique</a>' +
    '<a href="temoignages.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:2.25rem;font-weight:300;color:var(--white)">Témoignages</a>' +
    '<a href="contact.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:2.25rem;font-weight:300;color:var(--white)">Contact</a>' +
    '<a href="panier.html" onclick="closeMenu()" class="nav-link mt-4">Panier</a></div></div>';

  var OVERLAY =
    '<div id="site-menu-overlay" aria-hidden="true">' +
    '<button type="button" class="site-menu-close" onclick="closeSiteMenu()" aria-label="Fermer le menu">' +
    '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
    '<div class="site-menu-inner mm-overlay-minimal">' +
    // Left: Navigation
    '<div>' +
    '<p class="section-label mb-6" style="margin-bottom:1.4rem">Navigation</p>' +
    '<nav class="space-y-1">' +
    '<a href="index.html" class="block mm-overlay-link" onclick="closeSiteMenu()">' +
    '<span class="nav-num">01</span><span class="nav-big">Accueil</span></a>' +
    '<a href="about.html" class="block mm-overlay-link" onclick="closeSiteMenu()">' +
    '<span class="nav-num">02</span><span class="nav-big">À propos</span></a>' +
    '<a href="foi-valeurs.html" class="block mm-overlay-link" onclick="closeSiteMenu()">' +
    '<span class="nav-num">03</span><span class="nav-big">Ma foi &amp; mes valeurs</span></a>' +
    '<a href="shop.html" class="block mm-overlay-link" onclick="closeSiteMenu()">' +
    '<span class="nav-num">04</span><span class="nav-big">Bibliothèque</span></a>' +
    '<a href="tribunes.html" class="block mm-overlay-link" onclick="closeSiteMenu()">' +
    '<span class="nav-num">05</span><span class="nav-big">Tribunes</span></a>' +
    '<a href="coaching.html" class="block mm-overlay-link" onclick="closeSiteMenu()">' +
    '<span class="nav-num">06</span><span class="nav-big">Coaching</span></a>' +
    '<a href="clinique.html" class="block mm-overlay-link" onclick="closeSiteMenu()">' +
    '<span class="nav-num">07</span><span class="nav-big">La Clinique</span></a>' +
    '<a href="contact.html" class="block mm-overlay-link" onclick="closeSiteMenu()">' +
    '<span class="nav-num">08</span><span class="nav-big">Contact</span></a>' +
    '</nav>' +
    '</div>' +
    // Right: Info + Socials
    '<div class="mm-overlay-right">' +
    '<div class="mm-overlay-info">' +
    '<p class="section-label" style="margin-bottom:0.75rem">Livre en vedette</p>' +
    '<p class="mm-overlay-title">Chrepreneur</p>' +
    '<p class="mm-overlay-muted">Chrétien et Entrepreneur — sortie 30 juin 2026.</p>' +
    '<div class="full-divider my-6" style="border-top-color: rgba(196,146,42,0.10)"></div>' +
    '<p class="section-label" style="margin-bottom:0.75rem">Prochain événement</p>' +
    '<p class="mm-overlay-muted" style="color:var(--white);font-size:0.98rem">Masterclass — « Foi &amp; stratégie » (dates à confirmer).</p>' +
    '</div>' +
    '<div class="mm-overlay-social" aria-label="Réseaux sociaux">' +
    '<ul class="mm-overlay-social-list">' +
    '<li><a href="#" class="mm-overlay-social-link">LI</a></li>' +
    '<li><a href="#" class="mm-overlay-social-link">FB</a></li>' +
    '<li><a href="#" class="mm-overlay-social-link">IG</a></li>' +
    '</ul>' +
    '</div>' +
    '</div>' +
    '</div>' +
    // Minimal overlay-specific CSS (scoped via classes)
    '<style>' +
    '#site-menu-overlay{background:rgba(5,5,5,0.98)}' +
    '.mm-overlay-minimal{max-width:1200px;margin:0 auto;padding:7rem 1.5rem 4rem;display:grid;grid-template-columns:1fr 1fr;gap:4rem;}' +
    '@media (min-width:1024px){.mm-overlay-minimal{grid-template-columns:1fr 1fr}}' +
    '.mm-overlay-link{padding:0.45rem 0.1rem;transition:opacity 0.25s ease,transform 0.25s ease;}' +
    '.mm-overlay-link .nav-big{font-weight:400;}' +
    '.mm-overlay-link:hover{opacity:0.92;}' +
    '.mm-overlay-link:hover .nav-big{font-style:italic;color:var(--gold-light)}' +
    '.mm-overlay-right{display:flex;flex-direction:column;min-height:70vh;}' +
    '.mm-overlay-info{flex:1;}' +
    '.mm-overlay-title{font-family:"Cormorant Garant",serif;font-size:1.7rem;color:var(--gold-light);font-weight:300;line-height:1.2;margin:0 0 0.5rem 0}' +
    '.mm-overlay-muted{color:rgba(245,240,232,0.7);font-size:0.95rem;line-height:1.6;margin:0}' +
    '.mm-overlay-social{align-self:flex-end;margin-top:auto}' +
    '.mm-overlay-social-list{list-style:none;display:flex;gap:14px;padding:0;margin:0;}' +
    '.mm-overlay-social-link{color:rgba(245,240,232,0.72);text-decoration:none;font-size:0.8rem;letter-spacing:0.18em;text-transform:uppercase;font-family:"DM Sans",sans-serif;transition:opacity 0.2s ease, color 0.2s ease;}' +
    '.mm-overlay-social-link:hover{opacity:0.95;color:var(--gold-light)}' +
    '.mm-overlay-minimal a{border-bottom:none !important;text-decoration:none !important;}' +
    '.mm-overlay-minimal li{border-bottom:none !important;}' +
    '</style>' +
    '</div>';


  var CART =
    '<div class="cart-overlay" id="cart-overlay" onclick="toggleCart()"></div>' +
    '<div id="cart-drawer"><div class="p-6">' +
    '<div class="flex items-center justify-between mb-8">' +
    '<h3 style="font-family:\'Cormorant Garant\',serif;font-size:1.5rem;font-weight:500">Mon panier</h3>' +
    '<button type="button" onclick="toggleCart()" style="color:var(--muted)" aria-label="Fermer">' +
    '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>' +
    '<div id="cart-items" class="space-y-4"></div>' +
    '<div id="cart-footer" style="display:none">' +
    '<div class="full-divider my-6"></div>' +
    '<div class="flex justify-between mb-6"><span style="color:var(--muted);font-size:0.9rem">Total</span>' +
    '<span style="font-family:\'Cormorant Garant\',serif;font-size:1.5rem;color:var(--gold-light)" id="cart-total">0,00 €</span></div>' +
    '<a href="checkout.html" class="btn-gold w-full text-center block" onclick="toggleCart()">Passer à la caisse</a>' +
    '<p style="text-align:center;font-size:0.72rem;color:var(--muted);margin-top:1rem">Paiement sécurisé · Satisfait ou remboursé 30j</p></div></div></div>';

  var FOOTER =
    '<footer style="background:var(--dark-2);border-top:1px solid rgba(196,146,42,0.12)" class="py-14 px-6 lg:px-12">' +
    '<div class="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 mb-10">' +
    '<div class="md:col-span-2">' +
    '<div class="flex items-center gap-3 mb-4">' +
    '<div class="w-8 h-8 border flex items-center justify-center" style="border-color:var(--gold)">' +
    '<span style="font-family:\'Cormorant Garant\',serif;color:var(--gold);font-size:1rem;font-weight:600">M</span></div>' +
    '<span style="font-family:\'Cormorant Garant\',serif;font-size:1.15rem;font-weight:500">Mirichi Mbumba</span></div>' +
    '<p style="color:var(--muted);font-size:0.875rem;line-height:1.8;max-width:360px">Entrepreneur chrétien, auteur, coach. Fondateur de La Clinique de l\'Entrepreneuriat. Boutique en ligne agréée pour ses ouvrages.</p></div>' +
    '<div><div style="font-size:0.7rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem">Navigation</div>' +
    '<ul class="space-y-2" style="font-size:0.875rem;color:var(--muted)">' +
    '<li><a href="about.html" class="nav-link" style="display:inline;padding:0">À propos</a></li>' +
    '<li><a href="shop.html" class="nav-link" style="display:inline;padding:0">Shop</a></li>' +
    '<li><a href="tribunes.html" class="nav-link" style="display:inline;padding:0">Tribunes</a></li>' +
    '<li><a href="coaching.html" class="nav-link" style="display:inline;padding:0">Coaching</a></li>' +
    '<li><a href="contact.html" class="nav-link" style="display:inline;padding:0">Contact</a></li></ul></div>' +
    '<div><div style="font-size:0.7rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem">Boutique</div>' +
    '<ul class="space-y-2" style="font-size:0.875rem;color:var(--muted)">' +
    '<li><a href="shop.html" class="nav-link" style="display:inline;padding:0">Catalogue</a></li>' +
    '<li><a href="panier.html" class="nav-link" style="display:inline;padding:0">Panier</a></li>' +
    '<li><a href="checkout.html" class="nav-link" style="display:inline;padding:0">Checkout</a></li></ul></div></div>' +
    '<div class="max-w-7xl mx-auto flex flex-col gap-6" style="border-top:1px solid rgba(196,146,42,0.12);padding-top:1.5rem">' +
    '<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">' +
    '<p style="font-size:0.72rem;color:var(--muted)">© 2026 Mirichi Mbumba</p>' +
    '<div class="flex gap-4 flex-wrap" style="font-size:0.72rem;color:var(--muted)">' +
    '<a href="#" style="color:var(--muted)" target="_blank" rel="noopener noreferrer">Mentions légales</a>' +
    '<a href="#" style="color:var(--muted)" target="_blank" rel="noopener noreferrer">CGV</a>' +
    '<a href="#" style="color:var(--muted)" target="_blank" rel="noopener noreferrer">Confidentialité</a>' +
    '</div></div>' +
    '<div class="mm-footer-social" aria-label="Réseaux sociaux" style="display:flex;justify-content:flex-start;align-items:center;gap:16px;flex-wrap:wrap">' +
    '<a href="https://www.instagram.com/channel/AbZhXJm9JcZ2LSdX/" target="_blank" rel="noopener noreferrer" class="mm-footer-social-link" aria-label="Instagram (Chaîne)">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6z"/><path d="M17.8 6.2h.01"/></svg>' +
    '</a>' +
    '<a href="https://www.instagram.com/mirichy_22officiel" target="_blank" rel="noopener noreferrer" class="mm-footer-social-link" aria-label="Instagram (Perso)">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6z"/><path d="M17.8 6.2h.01"/></svg>' +
    '</a>' +
    '<a href="https://whatsapp.com/channel/0029VbAOXW1EKyZJ1byMkJ1f" target="_blank" rel="noopener noreferrer" class="mm-footer-social-link" aria-label="WhatsApp (Chaîne)">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.9 7.3L3.5 20.5l1.7-4.1A8.5 8.5 0 1 1 20.5 11.5z"/><path d="M8.8 9.3c.3-.6.6-.6.9-.6h.7c.2 0 .5.1.7.5.2.4.8 1.4.8 1.4.1.2.1.5 0 .7-.1.2-.2.3-.4.5l-.3.3c-.1.1-.2.3-.1.5.1.2.6 1.1 1.5 1.8 1.1.9 2 .9 2.2.9.2 0 .3-.1.4-.2l.5-.6c.1-.2.3-.2.5-.2s1.3.6 1.5.7c.2.1.4.2.4.4s0 .6-.2.9c-.2.3-.8.8-1.2 1-1 .5-2.2.4-3.5-.1-1.3-.5-2.7-1.7-3.5-2.7-.8-1-1.3-2.1-1.2-3 .1-.7.3-1.3.5-1.7z"/></svg>' +
    '</a>' +
    '<a href="https://www.linkedin.com/in/mirichy-mbumba-86ba29317" target="_blank" rel="noopener noreferrer" class="mm-footer-social-link" aria-label="LinkedIn">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 9.2V19.5"/><path d="M4.5 4.5h.01"/><path d="M9 19.5v-6.1c0-1.7 1-2.7 2.4-2.7 1.5 0 2.1 1.1 2.1 2.7v6.1"/><path d="M9 10.2v2"/></svg>' +
    '</a>' +
    '<a href="https://www.facebook.com/share/14e2FYMByHu/" target="_blank" rel="noopener noreferrer" class="mm-footer-social-link" aria-label="Facebook">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8h2V5h-2c-2 0-3.5 1.6-3.5 3.7V11H8v3h2.5v7H14v-7h2.2l.3-3H14V9c0-.6.2-1 1-1z"/></svg>' +
    '</a>' +
    '<a href="https://x.com/emirmirichi" target="_blank" rel="noopener noreferrer" class="mm-footer-social-link" aria-label="X (Twitter)">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l16 16"/><path d="M20 4L4 20"/></svg>' +
    '</a>' +
    '<a href="mailto:Mirichimbumba@gmail.com" target="_blank" rel="noopener noreferrer" class="mm-footer-social-link" aria-label="Gmail">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 6.5h15v11h-15z"/><path d="M5 7l7 6 7-6"/></svg>' +
    '</a>' +
    '</div>' +
    '</div>' +
    '</footer>';



  var navRoot = document.getElementById('mm-nav-root');
  if (navRoot) navRoot.innerHTML = NAV + MOBILE + OVERLAY;

  var cartRoot = document.getElementById('mm-cart-root');
  if (cartRoot) cartRoot.innerHTML = CART;

  var footerRoot = document.getElementById('mm-footer-root');
  if (footerRoot) footerRoot.innerHTML = FOOTER;
})();
