# Site Personnel — Mirichi Mbumba
## Document de Conception & Spécifications Complètes

> **Site officiel & unique boutique agréée** — Ce site est dédié à la personne de Mirichi Mbumba : auteur, coach, entrepreneur, conférencier et homme de foi. Il se distingue du site institutionnel de La Clinique de l'Entrepreneuriat.

---

## Table des Matières

1. [Vision du Projet](#1-vision-du-projet)
2. [Identité de la Marque](#2-identité-de-la-marque)
3. [Palette de Couleurs & Typographie](#3-palette-de-couleurs--typographie)
4. [Architecture du Site (15 Écrans)](#4-architecture-du-site-15-écrans)
5. [Pages Détaillées](#5-pages-détaillées)
6. [La Bibliothèque / Boutique Officielle](#6-la-bibliothèque--boutique-officielle)
7. [Espace Tribunes & Blog](#7-espace-tribunes--blog)
8. [Coaching & Services](#8-coaching--services)
9. [La Clinique de l'Entrepreneuriat — Page Liaison](#9-la-clinique-de-lentrepreneuriat--page-liaison)
10. [Fonctionnalités Techniques](#10-fonctionnalités-techniques)
11. [Spécifications UX/UI](#11-spécifications-uxui)
12. [SEO & Contenu](#12-seo--contenu)
13. [Stack Technique Recommandée](#13-stack-technique-recommandée)

---

## 1. Vision du Projet

### Positionnement
Le site **mirichiMbumba.com** est la vitrine personnelle et officielle de Mirichi Mbumba. Il met en lumière :

- **L'homme** : sa foi, son parcours, ses valeurs, sa vision
- **L'auteur** : ses livres, la seule boutique officielle de commande
- **Le coach** : ses services d'accompagnement individuels et collectifs
- **Le conférencier** : ses tribunes, articles, interventions publiques
- **L'entrepreneur** : son parcours et son incubateur (La Clinique)

### Ce site N'est PAS
- ❌ Le site institutionnel de La Clinique de l'Entrepreneuriat (site distinct)
- ❌ Un simple blog ou portfolio
- ❌ Une page vitrine ordinaire

### Ce site EST
- ✅ Un hub d'autorité autour de la personnalité de Mirichi Mbumba
- ✅ La seule boutique en ligne agréée pour acheter ses ouvrages
- ✅ Un espace de diffusion de ses idées et tribunes
- ✅ Un point d'entrée vers ses services de coaching

---

## 2. Identité de la Marque

### Positionnement de Marque
Mirichi Mbumba se positionne à l'intersection de **3 univers** :

```
ENTREPRENEUR ←→ HOMME DE FOI ←→ PENSEUR / AUTEUR
```

### Valeurs Clés
| Valeur | Manifestation |
|--------|---------------|
| **Foi Chrétienne** | Langage, references bibliques, ton ancré dans la spiritualité |
| **Excellence** | Design premium, contenu de haute qualité, UX soigné |
| **Impact** | Accent sur les résultats concrets, témoignages, chiffres |
| **Authenticité** | Ton personnel, direct, sans jargon artificiel |
| **Service** | L'accent est mis sur "ce que je peux faire pour vous" |

### Ton éditorial
- **Chaleureux** mais **autorité** — comme un mentor bienveillant
- **Inspirant** mais **concret** — des idées actionnables
- **Spirituel** mais **pragmatique** — foi et business réconciliés
- **Africain et universel** — ancré dans le contexte africain, mais ouvert au monde

### Slogan candidats
- *"Bâtisseur de Destins"*
- *"Entrepreneur par Vocation, Serviteur par Mission"*
- *"Là où la Foi rencontre l'Entrepreneuriat"*

---

## 3. Palette de Couleurs & Typographie

### Palette Principale

```css
/* Couleurs principales */
--navy:       #0D1B2A;   /* Fond principal — autorité, profondeur */
--navy-mid:   #162030;   /* Sections alternées */
--navy-light: #1E2F42;   /* Éléments secondaires dark */
--gold:       #C9A84C;   /* Accent principal — excellence, foi */
--gold-light: #E2C878;   /* Hover states, gradients */
--gold-pale:  #F5EDD4;   /* Fonds dorés légers, badges */
--cream:      #F8F4EC;   /* Fond principal light sections */
--cream-dark: #EDE8DF;   /* Bordures, séparateurs */
--white:      #FFFFFF;   /* Cards, formulaires */
--charcoal:   #2C3A4A;   /* Texte corps sur fond clair */
--muted:      #7A8A9A;   /* Texte secondaire, labels */
```

### Inspiration Colorimétrique
La palette est inspirée des sites des grands coaches mondiaux :
- **Tony Robbins** → force du contraste noir/or
- **Simon Sinek** → sobriété et professionnalisme
- **Brendon Burchard** → chaleur avec autorité
- **Lisa Nichols** → élégance et inclusivité

### Typographie

| Rôle | Police | Usage |
|------|--------|-------|
| **Display / Titres** | Playfair Display (serif) | H1, H2, citations, noms |
| **Interface / Corps** | Raleway (sans-serif) | Navigation, boutons, labels |
| **Editorial / Longform** | Cormorant Garamond (serif) | Articles, extraits de livres |

```css
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=Raleway:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
```

---

## 4. Architecture du Site (15 Écrans)

### Carte des Écrans

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MIRICHI MBUMBA — SITE MAP                      │
├────────────────┬───────────────────────────────────────────────────────┤
│  ÉCRAN 01      │  Hero Landing Page — Accueil                          │
│  ÉCRAN 02      │  Menu Navigation (Overlay)                            │
│  ÉCRAN 03      │  À Propos — Qui est Mirichi ?                         │
│  ÉCRAN 04      │  Ma Foi & Mes Valeurs                                 │
├────────────────┼───────────────────────────────────────────────────────┤
│  ÉCRAN 05      │  Bibliothèque — Catalogue Livres                      │
│  ÉCRAN 06      │  Détail d'un Livre (Page produit)                     │
│  ÉCRAN 07      │  Boutique — Panier                                    │
│  ÉCRAN 08      │  Checkout — Paiement                                  │
├────────────────┼───────────────────────────────────────────────────────┤
│  ÉCRAN 09      │  Mes Tribunes — Blog (Liste)                          │
│  ÉCRAN 10      │  Lecture d'un Article (Tribune)                       │
├────────────────┼───────────────────────────────────────────────────────┤
│  ÉCRAN 11      │  Coaching & Services                                  │
│  ÉCRAN 12      │  Réserver une Session (Calendrier)                    │
├────────────────┼───────────────────────────────────────────────────────┤
│  ÉCRAN 13      │  La Clinique de l'Entrepreneuriat (Liaison)           │
│  ÉCRAN 14      │  Témoignages & Impact                                 │
│  ÉCRAN 15      │  Contact, Newsletter & Footer                         │
└────────────────┴───────────────────────────────────────────────────────┘
```

### Navigation Principale

```
[LOGO / Mirichi Mbumba]  ←→  À Propos · Bibliothèque · Tribunes · Coaching · La Clinique · Contact
                                                                          [Réserver une session ↗]
```

---

## 5. Pages Détaillées

---

### ÉCRAN 01 — Hero Landing Page

**Objectif** : Créer une première impression mémorable et qualifier immédiatement le visiteur.

**Sections** :
- Logo / Nom en grand (typographie Playfair Display, taille XL)
- Sous-titre : Ses 5 identités (Entrepreneur · Auteur · Coach · Motivateur · Fondateur)
- Description courte (2-3 lignes)
- 2 CTA principaux :
  - `[Découvrir mes livres]` — bouton or plein → Bibliothèque
  - `[Réserver une session]` — bouton outline → Coaching
- Photo portrait officielle (placeholder prévu)
- Badge flottant : "15+ ans d'expertise"
- Indicateur de scroll animé
- Fond : Navy sombre avec lignes géométriques subtiles

**Éléments de différenciation** :
- Texte watermark "MM" en très grande typographie (opacity 4%)
- Portrait encadré avec bordure dorée
- Badge doré en bottom-right du portrait

---

### ÉCRAN 02 — Menu Navigation Overlay

**Objectif** : Navigation claire et élégante avec une valeur ajoutée visuelle.

**Structure** :
- Colonne gauche : Liens de navigation numérotés (01 → 08)
- Colonne droite : 
  - Réseaux sociaux (LinkedIn, Facebook, YouTube, Instagram, X)
  - Livre en vedette du moment
  - Prochaine conférence / événement
- Animation d'ouverture : transition fluide overlay
- Bouton fermeture visible

---

### ÉCRAN 03 — À Propos

**Objectif** : Raconter l'histoire de Mirichi de manière authentique et inspirante.

**Sections** :
- En-tête dark (navy) avec titre
- Grille 2 colonnes :
  - Photo portrait (colonne gauche)
  - Texte biographique + 4 piliers (colonne droite)
- Citation signature en bas (fond navy)

**Contenu biographique** (structure) :
1. Paragraphe d'introduction — qui il est fondamentalement
2. Sa foi comme moteur de son entrepreneuriat
3. La fondation de La Clinique de l'Entrepreneuriat
4. Son impact chiffré

**4 Piliers visuels** :
- Entrepreneur (15+ ans)
- Auteur (X ouvrages publiés)
- Coach (certifié, X accompagnés)
- Conférencier (international)

---

### ÉCRAN 04 — Ma Foi & Mes Valeurs

**Objectif** : Ancrer clairement l'identité chrétienne de Mirichi comme fondement de tout.

**Sections** :
- Hero section dark avec croix en watermark
- Grille 3×2 des 6 valeurs :
  1. Foi Chrétienne
  2. Service & Impact
  3. Intégrité
  4. Excellence
  5. Persévérance
  6. Transmission
- Verset biblique de clôture (fond doré)

**Ton** : Confiant, ancré, inspirant — sans être prosélyte ou exclusif.

---

## 6. La Bibliothèque / Boutique Officielle

---

### ÉCRAN 05 — Bibliothèque — Catalogue

**Objectif** : Présenter tous les ouvrages de façon attractive et inciter à l'achat.

**Mention légale importante** :
> ⚠️ **"La seule boutique en ligne agréée"** — mention à afficher clairement sur toutes les pages boutique.

**Filtres disponibles** :
- Tous les livres
- Entrepreneuriat
- Foi & Business
- Développement personnel
- Leadership

**Grille produits** : 4 colonnes × N lignes
- Couverture livre (avec couleur de fond thématique)
- Épine dorée (élément de design distinctif)
- Badge : Bestseller / Nouveau / Exclusif web
- Genre / Catégorie
- Titre
- Prix (avec ancien prix si promo)

**Banner Inférieur** :
- Pack Intégral — Toute la collection avec réduction

---

### ÉCRAN 06 — Page Détail Livre

**Sections** :
- Fil d'Ariane : Bibliothèque / Titre du livre
- Header dark :
  - Visuel couverture (gauche)
  - Métadonnées (droite) :
    - Auteur (Mirichi Mbumba)
    - Titre + sous-titre
    - Note étoiles + nombre d'avis
    - Prix actuel / Prix barré
    - CTA : `[Ajouter au panier]` + `[Acheter maintenant]`
    - Badges de réassurance (livraison, numérique, remboursement)
- Corps 2 colonnes :
  - Description longue + extraits + chapitres
  - Sidebar : Détails produit (pages, langue, édition, ISBN)

**Formats disponibles** :
- Broché (livre papier)
- PDF numérique
- Pack Papier + Numérique

---

### ÉCRAN 07 — Panier

**Sections** :
- Liste articles :
  - Miniature couverture
  - Titre + format choisi
  - Quantité (- / n / +) + suppression
  - Prix ligne
- Récapitulatif commande :
  - Sous-total
  - Frais de livraison
  - Code promo
  - **Total TTC**
  - CTA : `[Passer à la caisse]`
  - Champ code promotionnel
  - Garantie satisfait ou remboursé 30j
  - Icônes de confiance (paiement sécurisé, suivi, retours)

---

### ÉCRAN 08 — Checkout / Paiement

**Barre de progression** :
```
✓ Panier  →  [2 Informations]  →  3 Livraison  →  4 Paiement
```

**Formulaire** :
- Section "Informations personnelles" : Prénom, Nom, Email, Téléphone
- Section "Adresse de livraison" : Adresse, Ville, Code Postal, Pays
- Section "Méthode de paiement" :
  - Carte bancaire (Visa/Mastercard)
  - Mobile Money (M-Pesa, Orange Money, etc.)
  - PayPal

**Récapitulatif** : Panel latéral avec résumé de commande

---

## 7. Espace Tribunes & Blog

---

### ÉCRAN 09 — Mes Tribunes (Liste)

**Objectif** : Positionner Mirichi comme penseur de référence sur l'entrepreneuriat africain et la foi.

**Structure** :
- Hero section avec présentation du concept "tribunes"
- Grille featured (article principal + 3 articles secondaires)
- Liste d'articles classiques (grille 3 colonnes)

**Catégories de tribunes** :
- Entrepreneuriat & Stratégie
- Foi & Business
- Leadership
- Développement personnel
- Afrique & Économie
- Conférences & Récits

**Fréquence suggérée** : 2-4 articles/mois

---

### ÉCRAN 10 — Lecture d'un Article

**Structure** :
- Barre de navigation contextuelle (← retour + fil d'Ariane)
- Hero article :
  - Tag catégorie
  - Titre principal (grande typographie)
  - Sous-titre / chapeau
  - Métadonnées auteur + date + temps de lecture
- Corps de l'article :
  - Largeur max 720px (colonnes optimisées pour la lecture)
  - Police Cormorant Garamond 19px / line-height 1.9
  - Pull-quotes en or sur fond crème
  - Sidebar "Livre associé" flottante

**Éléments enrichissants** :
- Pull-quote (citation importante extraite)
- Sidebar "Livre associé" → CTA vers boutique
- Section "Articles en lien"
- Boutons de partage réseaux sociaux
- CTA bas d'article : réserver une session de coaching

---

## 8. Coaching & Services

---

### ÉCRAN 11 — Page Coaching

**Hero** :
- Statistiques d'impact :
  - 500+ Entrepreneurs accompagnés
  - 15+ Années d'expertise
  - 12 Pays d'intervention
- Témoignage mis en avant

**3 Offres de Coaching** :

#### 1. Coaching Individuel
- Format : 1-on-1 mensuel
- Durée : Séances de 90 min
- Avantages : WhatsApp entre séances, plan d'action personnalisé, livre offert
- Tarif : À partir de 350€/mois

#### 2. Programme Intensif 90 Jours ⭐ (Le plus populaire)
- Format : Programme structuré sur 3 mois
- Avantages : 12 séances, accès communauté privée, tous les livres, masterclasses exclusives, plan croissance 12 mois
- Tarif : 1 800€ (investissement total)

#### 3. Coaching Organisationnel
- Format : Accompagnement d'équipe dirigeante
- Avantages : Audit, sessions équipe, formation managers, suivi trimestriel
- Tarif : Sur devis

---

### ÉCRAN 12 — Réservation Session

**Système de booking intégré** :

1. **Sélection du type de session** :
   - Session Découverte (30 min, gratuit)
   - Coaching Individuel (90 min, 175€)
   - Session Stratégie Business (2h, 290€)
   - Audit Organisationnel (demi-journée, sur devis)

2. **Calendrier interactif** :
   - Vue mensuelle
   - Jours disponibles / indisponibles
   - Jours sélectionné mis en valeur (doré)

3. **Créneaux horaires** :
   - Grille de créneaux (disponible / non disponible / sélectionné)
   - Prise en compte des fuseaux horaires

4. **Confirmation** :
   - Récapitulatif du rendez-vous
   - CTA de confirmation
   - Email automatique de confirmation avec lien de visioconférence

**Outils de booking compatibles** : Calendly, Cal.com, Acuity Scheduling

---

## 9. La Clinique de l'Entrepreneuriat — Page Liaison

### ÉCRAN 13 — Page La Clinique

**Objectif** : Présenter La Clinique de façon concise et renvoyer vers le site dédié tout en maintenant le lien avec Mirichi.

**Sections** :

#### Hero section
- Logo / nom de La Clinique en grand
- Description courte (ce qu'est la Clinique)
- 2 CTA : Visiter + En savoir plus
- Lien vers le site externe (cliniquedelentrepreneuriat.com)

#### Les 4 Piliers de La Clinique
1. **Formation** — Programmes certifiants
2. **Incubation** — Accompagnement startups en lancement
3. **Accélération** — Scaling PME existantes
4. **Réseau** — Communauté entrepreneurs connectés

#### Section de Distinction Claire
Encadré explicatif :
- **Ce site** (mirichiMbumba.com) → Livres, coaching personnel, tribunes
- **La Clinique** (site séparé) → Incubateur, formation, programmes collectifs

#### CTA de Redirection
- Bouton vers le site de La Clinique avec mention : "Vous quittez le site personnel de Mirichi Mbumba"

---

## 10. Fonctionnalités Techniques

### ÉCRAN 14 — Témoignages & Impact

**Métriques affichées** :
- 500+ Entrepreneurs accompagnés
- 12 Pays d'intervention
- 8 Ouvrages publiés
- 98% Taux de satisfaction

**Grille de témoignages** : 3 colonnes
- Note étoiles
- Citation (entre guillemets)
- Auteur + Rôle + Entreprise / Pays
- 1 témoignage "featured" (fond navy, mise en avant)

**Section vidéo** :
- Player vidéo embed (YouTube ou Vimeo)
- Conférences, interviews, TEDs de Mirichi

---

### ÉCRAN 15 — Contact & Footer

#### Formulaire de contact
- Prénom / Nom
- Email
- Objet (liste déroulante) :
  - Commander un livre
  - Réserver une session de coaching
  - Inviter comme conférencier
  - Collaboration & Partenariat
  - Autre demande
- Message
- CTA : `[Envoyer mon message]`
- Délai de réponse garanti : 48h ouvrées

#### Newsletter — La Tribune de Mirichi
- Fréquence : Hebdomadaire
- Contenu : Réflexions exclusives, entrepreneuriat, foi, leadership
- Social proof : "Rejoignez 12 000 abonnés"
- Champ email + CTA `[S'abonner]`

#### Footer
- Logo + tagline
- Navigation secondaire
- Services
- Mentions légales / CGV / Confidentialité
- Réseaux sociaux
- Copyright

---

## 10. Fonctionnalités Techniques

### Boutique en ligne

| Fonctionnalité | Détail |
|----------------|--------|
| Catalogue produits | Livres physiques + numériques |
| Panier | Multi-articles, codes promo |
| Paiement | Carte bancaire, Mobile Money, PayPal |
| Livraison | Nationale + Internationale |
| PDF numérique | Téléchargement immédiat |
| Gestion commandes | Interface admin |
| Emails transactionnels | Confirmation, expédition, suivi |

### Booking système
- Intégration Calendly ou Cal.com
- Choix du type de session
- Calendrier temps réel
- Sélection créneau
- Confirmation automatique par email
- Lien visioconférence auto-généré (Zoom / Google Meet)

### Newsletter
- Intégration Mailchimp / Brevo / ConvertKit
- Double opt-in
- Séquence de bienvenue automatisée
- Segmentation par intérêt (lecteur / coach / conférence)

### Blog / Tribunes
- CMS intégré (Notion, Sanity ou CMS natif)
- Catégorisation
- Recherche plein texte
- Temps de lecture estimé
- Partage réseaux sociaux

### Analytics
- Google Analytics 4
- Meta Pixel (Facebook/Instagram ads)
- LinkedIn Insight Tag
- Hotjar (heatmaps UX)

---

## 11. Spécifications UX/UI

### Principes de Design

```
LUXURY EDITORIAL — inspiré des sites : Tony Robbins, Simon Sinek,
Brendon Burchard, Les Brown, Lisa Nichols
```

1. **Contraste fort** Navy/Or — lisibilité maximale et prestige
2. **Typographie hiérarchisée** — Playfair Display impose l'autorité
3. **Espacement généreux** — respiration, premium, confiance
4. **Animation subtile** — pas ostentatoire, juste fonctionnelle
5. **Mobile-first** — 60%+ du trafic sur mobile

### Hiérarchie visuelle

```
NIVEAU 1 : Nom de Mirichi (impact maximal)
NIVEAU 2 : Titre de section (Playfair Display, grande taille)
NIVEAU 3 : Sous-titre / tagline (Raleway, espacé)
NIVEAU 4 : Corps de texte (Cormorant Garamond ou Raleway)
NIVEAU 5 : Labels, métadonnées (Raleway, petit, capitales)
```

### Composants récurrents

#### Bouton Primaire (Or plein)
```css
background: #C9A84C;
color: #0D1B2A;
padding: 14px 32px;
font-family: 'Raleway', sans-serif;
font-weight: 700;
font-size: 12px;
letter-spacing: 2px;
text-transform: uppercase;
```

#### Bouton Secondaire (Outline)
```css
background: transparent;
color: #FFFFFF;
border: 1px solid rgba(255,255,255,0.3);
/* hover: border-color → gold, color → gold */
```

#### Section header dark
```css
background: #0D1B2A;
padding: 80-100px 80px;
.label: gold, uppercase, letter-spacing 4px
h2: Playfair Display, 52px, white
```

#### Card livre
```css
background: #FFFFFF;
overflow: hidden;
border-spine: 6px solid linear-gradient(gold-light, gold);
transition: translateY(-4px) on hover
```

### Responsive Breakpoints
- **Mobile** : < 768px — Navigation hamburger, colonne unique
- **Tablet** : 768px - 1024px — 2 colonnes max
- **Desktop** : > 1024px — Full layout, toutes les colonnes
- **Large** : > 1440px — Max-width 1400px centré

---

## 12. SEO & Contenu

### Stratégie SEO

**Mots-clés cibles principaux** :
- "Mirichi Mbumba"
- "coach entrepreneur africain"
- "livre entrepreneuriat chrétien"
- "coaching entrepreneuriat Kinshasa"
- "La Clinique de l'Entrepreneuriat"

**Mots-clés secondaires** :
- "entrepreneur chrétien Afrique"
- "coach foi business Afrique"
- "livre entrepreneur africain"
- "accompagnement entrepreneur RDC"

### Structure des URLs

```
/                           → Page d'accueil (Hero)
/a-propos/                  → À Propos
/foi-et-valeurs/            → Foi & Valeurs
/bibliotheque/              → Catalogue livres
/bibliotheque/[slug-livre]  → Page produit livre
/boutique/panier/           → Panier
/boutique/commande/         → Checkout
/tribunes/                  → Liste articles
/tribunes/[slug-article]    → Article
/coaching/                  → Services coaching
/coaching/reserver/         → Réservation session
/la-clinique/               → Page La Clinique
/temoignages/               → Témoignages
/contact/                   → Contact
```

### Meta Tags clés

```html
<!-- Page d'accueil -->
<title>Mirichi Mbumba — Entrepreneur, Auteur, Coach | Site Officiel</title>
<meta name="description" content="Découvrez Mirichi Mbumba : entrepreneur chrétien, auteur de [X] livres sur l'entrepreneuriat et la foi, coach certifié et fondateur de La Clinique de l'Entrepreneuriat. Commandez ses livres sur la seule boutique officielle.">

<!-- Open Graph -->
<meta property="og:title" content="Mirichi Mbumba — Entrepreneur · Auteur · Coach">
<meta property="og:description" content="[Description courte]">
<meta property="og:image" content="/images/og-mirichi-mbumba.jpg">
<meta property="og:type" content="website">
```

---

## 13. Stack Technique Recommandée

### Option A — Next.js (Recommandée)

```
Framework    : Next.js 14 (App Router)
CMS          : Sanity.io ou Contentful (livres + articles)
E-commerce   : Stripe (paiement) + custom API
Booking      : Calendly API ou Cal.com
Newsletter   : Brevo (Sendinblue) ou ConvertKit
Déploiement  : Vercel
Images       : Cloudinary
Formulaires  : React Hook Form + Resend (emails)
Analytics    : GA4 + Vercel Analytics
```

### Option B — WordPress

```
Theme        : Custom (ACF + CPT)
E-commerce   : WooCommerce
Booking      : WooCommerce Bookings ou Amelia
Newsletter   : MailerLite + WP plugin
Paiement     : Stripe + PayPal + Wave/MTN plugin
Déploiement  : Hébergeur WP spécialisé (Kinsta, WP Engine)
```

### Option C — Webflow + Intégrations

```
Site Builder  : Webflow (design + CMS)
E-commerce    : Webflow E-commerce
Booking       : Calendly embed
Newsletter    : Mailchimp embed
Paiement      : Stripe via Webflow
```

### Recommandation

> **Option A (Next.js)** pour une flexibilité maximale, des performances optimales et une scalabilité long terme. Idéal si vous avez un développeur dédié.
>
> **Option C (Webflow)** si vous souhaitez maintenir le site vous-même avec peu de code. Design de très haute qualité possible.

---

## Checklist de Lancement

### Phase 1 — Fondations
- [ ] Achat domaine : mirichiMbumba.com
- [ ] Logo vectoriel finalisé
- [ ] Photos officielles (portrait, action, conférences)
- [ ] Couleurs & typographie validées
- [ ] Rédaction contenu page À Propos
- [ ] Rédaction contenu Foi & Valeurs

### Phase 2 — Boutique
- [ ] Catalogue livres complet (titres, descriptions, couvertures)
- [ ] Configuration Stripe + Mobile Money
- [ ] Système de livraison configuré
- [ ] CGV rédigées et validées
- [ ] Politique de remboursement
- [ ] Versions PDF prêtes au téléchargement

### Phase 3 — Contenu
- [ ] 10 articles tribunes initiaux
- [ ] Vidéos intégrées (YouTube / Vimeo)
- [ ] 10-15 témoignages collectés
- [ ] Biographie complète rédigée
- [ ] Verset / Citation signature choisie

### Phase 4 — Coaching & Booking
- [ ] Types de sessions et tarifs validés
- [ ] Calendly / Cal.com configuré
- [ ] Emails de confirmation rédigés
- [ ] Stripe pour les sessions payantes

### Phase 5 — Lancement
- [ ] Tests toutes fonctionnalités
- [ ] Tests mobile / tablette / desktop
- [ ] SEO baseline (meta tags, sitemap, robots.txt)
- [ ] Google Search Console configurée
- [ ] Analytics configuré
- [ ] Annonce lancement (réseaux sociaux, newsletter)

---

## Contact & Gestion

**Site** : mirichiMbumba.com
**Email** : contact@mirichiMbumba.com
**WhatsApp Pro** : +243 XX XXX XXXX

**Boutique Officielle** : Seul point de vente en ligne agréé pour les ouvrages de Mirichi Mbumba.

**La Clinique de l'Entrepreneuriat** : [cliniquedelentrepreneuriat.com](https://cliniquedelentrepreneuriat.com)

---

*Document élaboré pour le projet de site personnel de Mirichi Mbumba.*
*Version 1.0 — Maquette complète 15 écrans*
*Palette : Navy #0D1B2A + Or #C9A84C + Crème #F8F4EC*
*Typographies : Playfair Display · Raleway · Cormorant Garamond*
