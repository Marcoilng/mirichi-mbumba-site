/**
 * Chrome partagé (nav, menu mobile, overlay « Menu », panier, footer).
 * Chaque page : placer <div id="mm-nav-root"></div> en haut du body,
 * <div id="mm-footer-root"></div> avant les scripts, <div id="mm-cart-root"></div> après le footer,
 * puis charger ce fichier AVANT _shared.js.
 */
(function () {
  /* Icônes officielles (marques) — SVG remplis */
  var SVG_IG =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>';
  var SVG_WA =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';
  var SVG_LI =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
  var SVG_FB =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
  var SVG_X =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.291 19.497h2.039L6.486 3.24H4.298l13.312 17.41z"/></svg>';
  var SVG_GM =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.278 24 3.434 24 5.457z"/></svg>';

  function socialLink(href, label, icon, extraClass) {
    var cls = 'mm-footer-social-link' + (extraClass ? ' ' + extraClass : '');
    return (
      '<a href="' +
      href +
      '" target="_blank" rel="noopener noreferrer" class="' +
      cls +
      '" aria-label="' +
      label +
      '">' +
      icon +
      '</a>'
    );
  }

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
    '<a href="formations.html" class="nav-link">Formations</a>' +
    '<a href="clinique.html" class="nav-link">La Clinique</a>' +
    '<a href="temoignages.html" class="nav-link">Témoignages</a>' +
    '<a href="galerie.html" class="nav-link">Galerie</a>' +
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

  var MOBILE_OVERLAY = '<div id="mobile-menu-overlay" onclick="closeMenu()" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:199;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);"></div>';

  var MOBILE =
    '<div id="mobile-menu" class="fixed inset-y-0 right-0 w-full max-w-xs flex flex-col lg:hidden" style="background:var(--dark-2);border-left:1px solid rgba(196,146,42,0.15);">' +
    // Close button
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid rgba(196,146,42,0.1);">' +
    '<span style="font-family:\'Cormorant Garant\',serif;font-size:1.1rem;color:var(--gold-light);font-weight:400;letter-spacing:0.05em;">Menu</span>' +
    '<button type="button" onclick="closeMenu()" aria-label="Fermer le menu" style="background:none;border:1px solid rgba(196,146,42,0.25);width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);border-radius:2px;transition:all 0.2s;" onmouseover="this.style.borderColor=\'var(--gold)\';this.style.color=\'var(--gold-light)\'" onmouseout="this.style.borderColor=\'rgba(196,146,42,0.25)\';this.style.color=\'var(--muted)\'">' +
    '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button></div>' +
    // Nav links
    '<nav style="flex:1;overflow-y:auto;padding:1.5rem;">' +
    '<div style="display:flex;flex-direction:column;gap:0.25rem;">' +
    '<a href="index.html"    onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:1.6rem;font-weight:300;color:var(--white);padding:0.55rem 0;border-bottom:1px solid rgba(196,146,42,0.07);display:block;transition:color 0.2s;" onmouseover="this.style.color=\'var(--gold-light)\'" onmouseout="this.style.color=\'var(--white)\'">Accueil</a>' +
    '<a href="about.html"   onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:1.6rem;font-weight:300;color:var(--white);padding:0.55rem 0;border-bottom:1px solid rgba(196,146,42,0.07);display:block;transition:color 0.2s;" onmouseover="this.style.color=\'var(--gold-light)\'" onmouseout="this.style.color=\'var(--white)\'">À propos</a>' +
    '<a href="foi-valeurs.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:1.6rem;font-weight:300;color:var(--white);padding:0.55rem 0;border-bottom:1px solid rgba(196,146,42,0.07);display:block;transition:color 0.2s;" onmouseover="this.style.color=\'var(--gold-light)\'" onmouseout="this.style.color=\'var(--white)\'">Foi &amp; Valeurs</a>' +
    '<a href="shop.html"    onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:1.6rem;font-weight:300;color:var(--white);padding:0.55rem 0;border-bottom:1px solid rgba(196,146,42,0.07);display:block;transition:color 0.2s;" onmouseover="this.style.color=\'var(--gold-light)\'" onmouseout="this.style.color=\'var(--white)\'">Shop</a>' +
    '<a href="tribunes.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:1.6rem;font-weight:300;color:var(--white);padding:0.55rem 0;border-bottom:1px solid rgba(196,146,42,0.07);display:block;transition:color 0.2s;" onmouseover="this.style.color=\'var(--gold-light)\'" onmouseout="this.style.color=\'var(--white)\'">Tribunes</a>' +
    '<a href="coaching.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:1.6rem;font-weight:300;color:var(--white);padding:0.55rem 0;border-bottom:1px solid rgba(196,146,42,0.07);display:block;transition:color 0.2s;" onmouseover="this.style.color=\'var(--gold-light)\'" onmouseout="this.style.color=\'var(--white)\'">Coaching</a>' +
    '<a href="formations.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:1.6rem;font-weight:300;color:var(--white);padding:0.55rem 0;border-bottom:1px solid rgba(196,146,42,0.07);display:block;transition:color 0.2s;" onmouseover="this.style.color=\'var(--gold-light)\'" onmouseout="this.style.color=\'var(--white)\'">Formations</a>' +
    '<a href="clinique.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:1.6rem;font-weight:300;color:var(--white);padding:0.55rem 0;border-bottom:1px solid rgba(196,146,42,0.07);display:block;transition:color 0.2s;" onmouseover="this.style.color=\'var(--gold-light)\'" onmouseout="this.style.color=\'var(--white)\'">La Clinique</a>' +
    '<a href="temoignages.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:1.6rem;font-weight:300;color:var(--white);padding:0.55rem 0;border-bottom:1px solid rgba(196,146,42,0.07);display:block;transition:color 0.2s;" onmouseover="this.style.color=\'var(--gold-light)\'" onmouseout="this.style.color=\'var(--white)\'">Témoignages</a>' +
    '<a href="galerie.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:1.6rem;font-weight:300;color:var(--white);padding:0.55rem 0;border-bottom:1px solid rgba(196,146,42,0.07);display:block;transition:color 0.2s;" onmouseover="this.style.color=\'var(--gold-light)\'" onmouseout="this.style.color=\'var(--white)\'">Galerie</a>' +
    '<a href="contact.html" onclick="closeMenu()" style="font-family:\'Cormorant Garant\',serif;font-size:1.6rem;font-weight:300;color:var(--white);padding:0.55rem 0;display:block;transition:color 0.2s;" onmouseover="this.style.color=\'var(--gold-light)\'" onmouseout="this.style.color=\'var(--white)\'">Contact</a>' +
    '</div></nav>' +
    // Bottom CTA
    '<div style="padding:1.25rem 1.5rem;border-top:1px solid rgba(196,146,42,0.1);display:flex;flex-direction:column;gap:0.75rem;">' +
    '<a href="reservation.html" onclick="closeMenu()" class="btn-gold" style="padding:14px;font-size:0.72rem;text-align:center;display:block;">Réserver une session</a>' +
    '</div>' +
    '</div>';

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
    '<a href="formations.html" class="block mm-overlay-link" onclick="closeSiteMenu()">' +
    '<span class="nav-num">07</span><span class="nav-big">Formations</span></a>' +
    '<a href="clinique.html" class="block mm-overlay-link" onclick="closeSiteMenu()">' +
    '<span class="nav-num">08</span><span class="nav-big">La Clinique</span></a>' +
    '<a href="galerie.html" class="block mm-overlay-link" onclick="closeSiteMenu()">' +
    '<span class="nav-num">09</span><span class="nav-big">Galerie</span></a>' +
    '<a href="contact.html" class="block mm-overlay-link" onclick="closeSiteMenu()">' +
    '<span class="nav-num">10</span><span class="nav-big">Contact</span></a>' +
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
    '<li>' +
    socialLink('https://www.linkedin.com/in/mirichy-mbumba-86ba29317', 'LinkedIn', SVG_LI, 'mm-overlay-social-link') +
    '</li>' +
    '<li>' +
    socialLink('https://www.facebook.com/share/14e2FYMByHu/', 'Facebook', SVG_FB, 'mm-overlay-social-link') +
    '</li>' +
    '<li>' +
    socialLink('https://www.instagram.com/mirichy_22officiel', 'Instagram', SVG_IG, 'mm-overlay-social-link') +
    '</li>' +
    '<li>' +
    socialLink('https://x.com/emirmirichi', 'X', SVG_X, 'mm-overlay-social-link') +
    '</li>' +
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
    '.mm-overlay-social-list{list-style:none;display:flex;gap:12px;padding:0;margin:0;flex-wrap:wrap}' +
    '.mm-overlay-social-link.mm-footer-social-link{width:44px;height:44px;border-radius:50%;border:1px solid rgba(196,146,42,0.22);display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.03);transition:all 0.25s ease}' +
    '.mm-overlay-social-link.mm-footer-social-link:hover{border-color:rgba(232,184,75,0.55);color:var(--gold-light);transform:translateY(-2px)}' +
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
    '<li><a href="formations.html" class="nav-link" style="display:inline;padding:0">Formations</a></li>' +
    '<li><a href="galerie.html" class="nav-link" style="display:inline;padding:0">Galerie</a></li>' +
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
    '<div class="mm-footer-social" aria-label="Réseaux sociaux" style="display:flex;justify-content:flex-start;align-items:center;gap:12px;flex-wrap:wrap">' +
    socialLink('https://www.instagram.com/channel/AbZhXJm9JcZ2LSdX/', 'Instagram (Chaîne)', SVG_IG) +
    socialLink('https://www.instagram.com/mirichy_22officiel', 'Instagram (Perso)', SVG_IG) +
    socialLink('https://whatsapp.com/channel/0029VbAOXW1EKyZJ1byMkJ1f', 'WhatsApp (Chaîne)', SVG_WA) +
    socialLink('https://www.linkedin.com/in/mirichy-mbumba-86ba29317', 'LinkedIn', SVG_LI) +
    socialLink('https://www.facebook.com/share/14e2FYMByHu/', 'Facebook', SVG_FB) +
    socialLink('https://x.com/emirmirichi', 'X (Twitter)', SVG_X) +
    socialLink('mailto:Mirichimbumba@gmail.com', 'Gmail', SVG_GM) +
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
