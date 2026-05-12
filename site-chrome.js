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
    '<a href="bibliotheque.html" class="nav-link">Bibliothèque</a>' +
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
    '<a href="bibliotheque.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:2.25rem;font-weight:300;color:var(--white)">Bibliothèque</a>' +
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
    '<div class="site-menu-inner"><div><p class="section-label mb-6">Navigation</p><nav class="space-y-1">' +
    '<a href="index.html" class="block" onclick="closeSiteMenu()"><span class="nav-num">01</span><span class="nav-big">Accueil</span></a>' +
    '<a href="about.html" class="block" onclick="closeSiteMenu()"><span class="nav-num">02</span><span class="nav-big">À propos</span></a>' +
    '<a href="foi-valeurs.html" class="block" onclick="closeSiteMenu()"><span class="nav-num">03</span><span class="nav-big">Ma foi &amp; mes valeurs</span></a>' +
    '<a href="bibliotheque.html" class="block" onclick="closeSiteMenu()"><span class="nav-num">04</span><span class="nav-big">Bibliothèque</span></a>' +
    '<a href="tribunes.html" class="block" onclick="closeSiteMenu()"><span class="nav-num">05</span><span class="nav-big">Tribunes</span></a>' +
    '<a href="coaching.html" class="block" onclick="closeSiteMenu()"><span class="nav-num">06</span><span class="nav-big">Coaching</span></a>' +
    '<a href="clinique.html" class="block" onclick="closeSiteMenu()"><span class="nav-num">07</span><span class="nav-big">La Clinique</span></a>' +
    '<a href="contact.html" class="block" onclick="closeSiteMenu()"><span class="nav-num">08</span><span class="nav-big">Contact</span></a></nav></div>' +
    '<div class="space-y-10"><div><p class="section-label mb-4">Réseaux</p><div class="flex flex-wrap gap-3">' +
    '<a href="#" class="clinique-pill">LinkedIn</a><a href="#" class="clinique-pill">Facebook</a><a href="#" class="clinique-pill">YouTube</a><a href="#" class="clinique-pill">Instagram</a><a href="#" class="clinique-pill">X</a></div></div>' +
    '<div class="card-dark p-6"><p class="section-label mb-3">Livre en vedette</p>' +
    '<p style="font-family:\'Cormorant Garant\',serif;font-size:1.5rem;color:var(--white)">Chrepreneur</p>' +
    '<p style="color:var(--muted);font-size:0.85rem;margin:0.5rem 0 1rem">Chrétien et Entrepreneur — sortie 30 juin 2026.</p>' +
    '<a href="livre.html" class="btn-gold inline-block" style="padding:10px 20px;font-size:0.7rem" onclick="closeSiteMenu()">Découvrir</a></div>' +
    '<div class="card-dark p-6"><p class="section-label mb-3">Prochain événement</p>' +
    '<p style="color:var(--white);font-size:0.95rem">Masterclass — « Foi &amp; stratégie » (dates à confirmer).</p></div></div></div></div>';

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
    '<li><a href="bibliotheque.html" class="nav-link" style="display:inline;padding:0">Bibliothèque</a></li>' +
    '<li><a href="tribunes.html" class="nav-link" style="display:inline;padding:0">Tribunes</a></li>' +
    '<li><a href="coaching.html" class="nav-link" style="display:inline;padding:0">Coaching</a></li>' +
    '<li><a href="contact.html" class="nav-link" style="display:inline;padding:0">Contact</a></li></ul></div>' +
    '<div><div style="font-size:0.7rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem">Boutique</div>' +
    '<ul class="space-y-2" style="font-size:0.875rem;color:var(--muted)">' +
    '<li><a href="bibliotheque.html" class="nav-link" style="display:inline;padding:0">Catalogue</a></li>' +
    '<li><a href="panier.html" class="nav-link" style="display:inline;padding:0">Panier</a></li>' +
    '<li><a href="checkout.html" class="nav-link" style="display:inline;padding:0">Checkout</a></li></ul></div></div>' +
    '<div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-4" style="border-top:1px solid rgba(196,146,42,0.12);padding-top:1.5rem">' +
    '<p style="font-size:0.72rem;color:var(--muted)">© 2026 Mirichi Mbumba</p>' +
    '<div class="flex gap-4 flex-wrap" style="font-size:0.72rem;color:var(--muted)">' +
    '<a href="#" style="color:var(--muted)">Mentions légales</a><a href="#" style="color:var(--muted)">CGV</a><a href="#" style="color:var(--muted)">Confidentialité</a></div></div></footer>';

  var navRoot = document.getElementById('mm-nav-root');
  if (navRoot) navRoot.innerHTML = NAV + MOBILE + OVERLAY;

  var cartRoot = document.getElementById('mm-cart-root');
  if (cartRoot) cartRoot.innerHTML = CART;

  var footerRoot = document.getElementById('mm-footer-root');
  if (footerRoot) footerRoot.innerHTML = FOOTER;
})();
