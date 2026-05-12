// Shared JS: navbar, reveals, counters, cart (localStorage), modal, mobile menu, site overlay.

(function () {
  const CART_KEY = 'mm_cart_v1';

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function updateCartUI() {
    const cart = loadCart();
    const count = cart.reduce(function (s, i) {
      return s + (Number(i.qty) || 0);
    }, 0);
    const badges = document.querySelectorAll('#cart-count');
    badges.forEach(function (el) {
      el.textContent = String(count);
    });

    const itemsEl = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    if (itemsEl) {
      if (cart.length === 0) {
        itemsEl.innerHTML =
          '<div style="text-align:center;color:var(--muted);padding:3rem 0"><div style="font-size:2rem;margin-bottom:1rem;opacity:0.3">📚</div><p style="font-size:0.875rem">Votre panier est vide</p></div>';
        if (footer) footer.style.display = 'none';
      } else {
        itemsEl.innerHTML = cart
          .map(function (i, idx) {
            var line = (Number(i.price) || 0) * (Number(i.qty) || 0);
            var nm = String(i.name);
            return (
              '<div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 0;border-bottom:1px solid rgba(196,146,42,0.1)">' +
              '<div><div style="font-size:0.875rem;margin-bottom:4px">' +
              nm.replace(/</g, '&lt;') +
              '</div><div style="font-size:0.75rem;color:var(--muted)">' +
              (Number(i.price) || 0).toFixed(2) +
              ' € × ' +
              (Number(i.qty) || 0) +
              '</div></div>' +
              '<div style="display:flex;align-items:center;gap:8px">' +
              "<span style=\"font-family:'Cormorant Garant',serif;color:var(--gold-light)\">" +
              line.toFixed(2) +
              ' €</span>' +
              '<button type="button" onclick="removeFromCartAt(' +
              idx +
              ')" style="color:var(--muted);font-size:0.7rem;background:none;border:none;cursor:pointer">✕</button>' +
              '</div></div>'
            );
          })
          .join('');
        var total = cart.reduce(function (s, i) {
          return s + (Number(i.price) || 0) * (Number(i.qty) || 0);
        }, 0);
        var totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.textContent = total.toFixed(2) + ' €';
        if (footer) footer.style.display = 'block';
      }
    }

    var panierRoot = document.getElementById('panier-page-root');
    if (panierRoot) renderPanierPage(cart);
    var checkoutRoot = document.getElementById('checkout-summary-root');
    if (checkoutRoot) renderCheckoutSummary(cart);
  }

  function renderPanierPage(cart) {
    var root = document.getElementById('panier-page-root');
    var empty = document.getElementById('panier-empty');
    var list = document.getElementById('panier-lines');
    if (!root || !empty || !list) return;
    if (cart.length === 0) {
      empty.style.display = 'block';
      list.innerHTML = '';
      list.style.display = 'none';
    } else {
      empty.style.display = 'none';
      list.style.display = 'block';
      list.innerHTML = cart
        .map(function (i, idx) {
          var line = (Number(i.price) || 0) * (Number(i.qty) || 0);
          var nm = String(i.name);
          var fmt = i.format ? String(i.format) : 'Broché';
          return (
            '<div class="card-dark p-6 flex flex-col md:flex-row md:items-center gap-6">' +
            '<div class="book-cover w-full md:w-28 shrink-0" style="border-radius:2px;min-height:120px;max-width:100px"><div class="flex items-center justify-center h-full text-xs text-center px-2" style="color:var(--muted)">' +
            nm.replace(/</g, '&lt;') +
            '</div></div>' +
            '<div class="flex-1 min-w-0">' +
            '<h3 style="font-family:\'Cormorant Garant\',serif;font-size:1.25rem;margin-bottom:0.25rem">' +
            nm.replace(/</g, '&lt;') +
            '</h3>' +
            '<p style="font-size:0.8rem;color:var(--muted)">' +
            fmt.replace(/</g, '&lt;') +
            '</p></div>' +
            '<div class="flex items-center gap-3">' +
            '<button type="button" class="btn-outline" style="padding:8px 12px;font-size:0.75rem" onclick="changeQtyAt(' +
            idx +
            ',-1)">−</button>' +
            '<span style="min-width:2rem;text-align:center">' +
            (Number(i.qty) || 0) +
            '</span>' +
            '<button type="button" class="btn-outline" style="padding:8px 12px;font-size:0.75rem" onclick="changeQtyAt(' +
            idx +
            ',1)">+</button></div>' +
            '<div style="font-family:\'Cormorant Garant\',serif;font-size:1.35rem;color:var(--gold-light);white-space:nowrap">' +
            line.toFixed(2) +
            ' €</div>' +
            '<button type="button" onclick="removeFromCartAt(' +
            idx +
            ')" class="nav-link" style="border:none;background:none;cursor:pointer">Retirer</button>' +
            '</div>'
          );
        })
        .join('');
    }
    var sub = cart.reduce(function (s, i) {
      return s + (Number(i.price) || 0) * (Number(i.qty) || 0);
    }, 0);
    var ship = sub > 0 ? 4.9 : 0;
    var elSub = document.getElementById('panier-subtotal');
    var elShip = document.getElementById('panier-shipping');
    var elTotal = document.getElementById('panier-total');
    if (elSub) elSub.textContent = sub.toFixed(2) + ' €';
    if (elShip) elShip.textContent = ship.toFixed(2) + ' €';
    if (elTotal) elTotal.textContent = (sub + ship).toFixed(2) + ' €';
  }

  function renderCheckoutSummary(cart) {
    var list = document.getElementById('checkout-lines');
    if (!list) return;
    if (cart.length === 0) {
      list.innerHTML = '<p style="color:var(--muted);font-size:0.9rem">Panier vide — <a href="bibliotheque.html" style="color:var(--gold)">Bibliothèque</a></p>';
    } else {
      list.innerHTML = cart
        .map(function (i) {
          var line = (Number(i.price) || 0) * (Number(i.qty) || 0);
          return (
            '<div class="flex justify-between gap-4 py-2" style="border-bottom:1px solid rgba(196,146,42,0.1)">' +
            '<span style="font-size:0.875rem">' +
            i.name +
            ' × ' +
            i.qty +
            '</span>' +
            '<span style="color:var(--gold-light)">' +
            line.toFixed(2) +
            ' €</span></div>'
          );
        })
        .join('');
    }
    var sub = cart.reduce(function (s, i) {
      return s + (Number(i.price) || 0) * (Number(i.qty) || 0);
    }, 0);
    var ship = sub > 0 ? 4.9 : 0;
    var tSub = document.getElementById('chk-subtotal');
    var tShip = document.getElementById('chk-shipping');
    var tTot = document.getElementById('chk-total');
    if (tSub) tSub.textContent = sub.toFixed(2) + ' €';
    if (tShip) tShip.textContent = ship.toFixed(2) + ' €';
    if (tTot) tTot.textContent = (sub + ship).toFixed(2) + ' €';
  }

  window.addToCart = function (name, price, format) {
    var cart = loadCart();
    var p = parseFloat(String(price).replace(',', '.')) || 0;
    var existing = cart.find(function (i) {
      return i.name === name && (i.format || '') === (format || '');
    });
    if (existing) existing.qty = (Number(existing.qty) || 0) + 1;
    else cart.push({ name: name, price: p, qty: 1, format: format || 'Broché' });
    saveCart(cart);
    updateCartUI();
    openCart();
  };

  window.removeFromCart = function (name) {
    var cart = loadCart().filter(function (i) {
      return i.name !== name;
    });
    saveCart(cart);
    updateCartUI();
  };

  window.removeFromCartAt = function (idx) {
    var cart = loadCart();
    var i = parseInt(idx, 10);
    if (isNaN(i) || i < 0 || i >= cart.length) return;
    cart.splice(i, 1);
    saveCart(cart);
    updateCartUI();
  };

  window.changeQty = function (name, delta) {
    var cart = loadCart();
    var item = cart.find(function (i) {
      return i.name === name;
    });
    if (!item) return;
    item.qty = (Number(item.qty) || 0) + delta;
    if (item.qty <= 0) cart = cart.filter(function (i) {
      return i.name !== name;
    });
    saveCart(cart);
    updateCartUI();
  };

  window.changeQtyAt = function (idx, delta) {
    var cart = loadCart();
    var i = parseInt(idx, 10);
    var d = parseInt(delta, 10) || 0;
    if (isNaN(i) || i < 0 || i >= cart.length) return;
    cart[i].qty = (Number(cart[i].qty) || 0) + d;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    saveCart(cart);
    updateCartUI();
  };

  window.openCart = function () {
    var drawer = document.getElementById('cart-drawer');
    var overlay = document.getElementById('cart-overlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
  };

  window.toggleCart = function () {
    var drawer = document.getElementById('cart-drawer');
    var overlay = document.getElementById('cart-overlay');
    if (!drawer) {
      window.location.href = 'panier.html';
      return;
    }
    if (drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    } else openCart();
  };

  window.openSiteMenu = function () {
    var o = document.getElementById('site-menu-overlay');
    if (o) {
      o.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeSiteMenu = function () {
    var o = document.getElementById('site-menu-overlay');
    if (o) {
      o.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  window.openModal = function () {
    var m = document.getElementById('book-modal');
    if (m) {
      m.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function () {
    var m = document.getElementById('book-modal');
    if (m) {
      m.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    updateCartUI();
    var m = document.getElementById('book-modal');
    if (m) {
      m.addEventListener('click', function (e) {
        if (e.target === m) closeModal();
      });
    }
    var site = document.getElementById('site-menu-overlay');
    if (site) {
      site.addEventListener('click', function (e) {
        if (e.target === site) closeSiteMenu();
      });
    }
  });

  window.addEventListener('mm-cart-updated', function () {
    updateCartUI();
  });
})();

// Navbar scroll
(function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
})();

// Reveal on scroll
(function () {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals || !reveals.length) return;
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  reveals.forEach(function (r) {
    observer.observe(r);
  });
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.querySelectorAll('#hero .reveal').forEach(function (el) {
        el.classList.add('visible');
      });
    }, 200);
  });
})();

// Counter animation
(function () {
  var counters = document.querySelectorAll('.counter-animate');
  if (!counters || !counters.length) return;
  var counterObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          var target = parseInt(el.dataset.target, 10) || 0;
          var suffix = target >= 10 ? '+' : '';
          var current = 0;
          var step = target / 60;
          var timer = setInterval(function () {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current) + suffix;
            if (current >= target) clearInterval(timer);
          }, 20);
          counterObs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(function (c) {
    counterObs.observe(c);
  });
})();

// Mobile menu (hamburger)
(function () {
  var menuOpen = false;
  window.toggleMenu = function () {
    menuOpen = !menuOpen;
    var menu = document.getElementById('mobile-menu');
    if (!menu) return;
    var b1 = document.getElementById('bar1');
    var b2 = document.getElementById('bar2');
    var b3 = document.getElementById('bar3');
    if (menuOpen) {
      menu.classList.add('open');
      if (b1) b1.style.transform = 'rotate(45deg) translateY(8px)';
      if (b2) b2.style.opacity = '0';
      if (b3) b3.style.transform = 'rotate(-45deg) translateY(-8px)';
      document.body.style.overflow = 'hidden';
    } else window.closeMenu();
  };
  window.closeMenu = function () {
    menuOpen = false;
    var menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.remove('open');
    var b1 = document.getElementById('bar1');
    var b2 = document.getElementById('bar2');
    var b3 = document.getElementById('bar3');
    if (b1) b1.style.transform = '';
    if (b2) b2.style.opacity = '';
    if (b3) b3.style.transform = '';
    document.body.style.overflow = '';
  };
})();

// Promo code (panier)
window.applyPromo = function () {
  var input = document.getElementById('promo-input');
  var msg = document.getElementById('promo-msg');
  if (!input) return;
  var v = (input.value || '').trim().toUpperCase();
  if (v === 'MIRICHI10') {
    if (msg) msg.textContent = 'Code appliqué : −10 % sur le sous-total (démo).';
  } else if (v) {
    if (msg) msg.textContent = 'Code non reconnu (essayez MIRICHI10 en démo).';
  } else if (msg) msg.textContent = '';
};

window.filterBooks = function (cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.book-item').forEach(function (item) {
    if (cat === 'all' || item.getAttribute('data-category') === cat) item.style.display = '';
    else item.style.display = 'none';
  });
};
