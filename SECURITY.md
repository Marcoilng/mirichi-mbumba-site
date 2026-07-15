# Guide de Sécurité — Site Mirichi Mbumba

## Architecture de Sécurité

### Couches de Sécurité Implémentées

| Couche | Mécanisme | Statut |
|--------|-----------|--------|
| **Headers HTTP** | CSP, HSTS, X-Frame-Options, Referrer-Policy | ✅ `vercel.json` |
| **Admin `noindex`** | `robots: noindex, nofollow` | ✅ `admin.html` |
| **Credentials DB** | Variables d'env Vercel → meta tags | ✅ `prepare-deploy.mjs` |
| **Auth Admin** | Supabase Auth + rate limiting 5 tentatives | ✅ `admin-dashboard.js` |
| **Anti-XSS** | `sanitizeText()` sur tous les rendus dynamiques | ✅ `admin-dashboard.js`, `db-client.js` |
| **Anti-spam** | Rate limiting 60s sur formulaires publics | ✅ `contact.html`, `reservation.html` |
| **Validation** | Longueurs max + format email côté client et DB | ✅ Formulaires + `db-client.js` |
| **RLS Supabase** | Row Level Security sur toutes les tables | ⚙️ À configurer dans Supabase |

---

## Configuration Vercel (OBLIGATOIRE pour la production)

### Variables d'Environnement à définir dans le Dashboard Vercel

Allez dans : **Vercel Dashboard → Votre Projet → Settings → Environment Variables**

| Variable | Description | Exemple |
|----------|-------------|---------|
| `SUPABASE_URL` | URL du projet Supabase | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Clé publique anon Supabase | `eyJhbGci...` |

> ⚠️ **IMPORTANT :** Ces variables ne doivent JAMAIS être commitées dans le code source Git.
> Le script `scripts/prepare-deploy.mjs` les injecte automatiquement dans les meta tags HTML lors du build Vercel.

### Comment fonctionnent les credentials en production

```
Vercel Build Time:
  SUPABASE_URL + SUPABASE_ANON_KEY (env vars)
       ↓
  scripts/prepare-deploy.mjs
       ↓
  <meta name="supabase-url"> injected in every .html file
  <meta name="supabase-anon-key"> injected in every .html file
       ↓
  db-client.js reads these meta tags at runtime
       ↓
  Supabase connection established
```

### Config Supabase - Politiques RLS Recommandées

Exécutez ce SQL dans l'éditeur SQL de Supabase :

```sql
-- RESERVATIONS : Public peut insérer, admin peut tout faire
CREATE POLICY "public_insert_reservations" ON reservations
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "admin_all_reservations" ON reservations
  FOR ALL TO authenticated USING (true);

-- MESSAGES : Public peut insérer, admin peut tout faire  
CREATE POLICY "public_insert_messages" ON messages
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "admin_all_messages" ON messages
  FOR ALL TO authenticated USING (true);

-- NEWSLETTER : Public peut insérer, admin peut tout faire
CREATE POLICY "public_insert_newsletter" ON newsletter
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "admin_all_newsletter" ON newsletter
  FOR ALL TO authenticated USING (true);

-- ARTICLES : Public lecture, admin écriture
CREATE POLICY "public_read_articles" ON articles
  FOR SELECT TO anon USING (true);
CREATE POLICY "admin_all_articles" ON articles
  FOR ALL TO authenticated USING (true);

-- FORMATIONS : Public lecture, admin écriture
CREATE POLICY "public_read_formations" ON formations
  FOR SELECT TO anon USING (true);
CREATE POLICY "admin_all_formations" ON formations
  FOR ALL TO authenticated USING (true);
```

---

## Protection Anti-Bruteforce Admin

Le formulaire de login admin (`admin.html`) implémente :
- **5 tentatives max** par session
- **Verrouillage 15 minutes** après épuisement des tentatives
- **Affichage du compte à rebours** (minutes restantes)
- **Validation format email** avant envoi

---

## Notes de Développement Local

En mode développement local (sans Vercel), le site fonctionne en mode **Local Storage** :
- Aucune connexion Supabase
- Les données sont stockées uniquement dans le navigateur
- Pour tester Supabase localement : passer par le dashboard admin et entrer les credentials manuellement (stockés en localStorage)
