# Configuration Supabase - TOUCH UP Event Booking

## Étape 1: Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations:
   - **Name**: `touch-up-event`
   - **Database Password**: (choisissez un mot de passe fort)
   - **Region**: Choisissez la région la plus proche de vos utilisateurs (ex: `eu-west-1`)
5. Attendez que le projet soit créé (environ 2 minutes)

## Étape 2: Exécuter le schéma de base de données

1. Dans votre dashboard Supabase, allez dans **SQL Editor**
2. Cliquez sur "New Query"
3. Copiez le contenu du fichier `supabase-schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur "Run" pour exécuter le script

Cela créera:
- La table `bookings` avec tous les champs nécessaires
- Les politiques de sécurité (RLS)
- Les fonctions pour le comptage et la validation
- Les index pour optimiser les performances

## Étape 3: Récupérer les credentials

1. Dans votre dashboard Supabase, allez dans **Settings** → **API**
2. Copiez les valeurs suivantes:
   - **Project URL** (ex: `https://xxxxxxxx.supabase.co`)
   - **anon/public key** (ex: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Étape 4: Configurer les variables d'environnement Vercel

### Option A: Via l'interface Vercel

1. Allez sur votre dashboard Vercel
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les variables suivantes:

| Nom | Valeur |
|-----|--------|
| `SUPABASE_URL` | Votre Project URL (étape 3) |
| `SUPABASE_ANON_KEY` | Votre anon/public key (étape 3) |

### Option B: Via CLI Vercel

```bash
vercel env add SUPABASE_URL
# Entrez votre Project URL

vercel env add SUPABASE_ANON_KEY
# Entrez votre anon/public key
```

## Étape 5: Déployer

Le script `prepare-deploy.mjs` injectera automatiquement les credentials Supabase dans les fichiers HTML lors du déploiement.

```bash
npm run build
vercel --prod
```

## Étape 6: Vérifier le fonctionnement

1. Ouvrez le site déployé
2. Allez sur la page Événements
3. Vérifiez dans la console du navigateur:
   - Si vous voyez "Supabase initialized successfully" → ✅ OK
   - Si vous voyez "Supabase credentials not found" → ❌ Vérifiez les variables d'environnement

## Fonctionnalités Supabase activées

### Comptage global des places
- Le compteur de places est maintenant synchronisé entre tous les utilisateurs
- Quand une personne réserve, le compteur diminue pour tout le monde
- La fermeture des inscriptions est automatique quand 100 places sont atteintes

### Protection contre les doubles réservations
- Un email ne peut réserver qu'une seule place par événement
- Validation côté serveur via Supabase

### Fallback localStorage
- Si Supabase n'est pas configuré, le système fonctionne en mode localStorage
- Utile pour le développement local

## Structure de la table `bookings`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | ID unique de la réservation |
| `ticket_code` | TEXT | Code unique du ticket (ex: MIR-ABC123-XYZ789) |
| `full_name` | TEXT | Nom complet du participant |
| `email` | TEXT | Email du participant (unique par événement) |
| `phone` | TEXT | Numéro de téléphone |
| `message` | TEXT | Message optionnel |
| `photo_url` | TEXT | URL de la photo (optionnel) |
| `event_id` | INTEGER | ID de l'événement (1 pour TOUCH UP) |
| `booking_date` | TIMESTAMP | Date de réservation |
| `created_at` | TIMESTAMP | Date de création |

## Sécurité

- **RLS (Row Level Security)** activé
- Politiques permettant la lecture et l'insertion publiques
- Contrainte unique sur `(email, event_id)` pour empêcher les doubles
- Fonctions SQL sécurisées avec `SECURITY DEFINER`

## Dépannage

### Problème: "Supabase credentials not found"
**Solution**: Vérifiez que les variables d'environnement `SUPABASE_URL` et `SUPABASE_ANON_KEY` sont configurées dans Vercel.

### Problème: Les réservations ne s'enregistrent pas
**Solution**: 
1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez que le schéma SQL a été exécuté correctement
3. Vérifiez les permissions RLS dans Supabase

### Problème: Le compteur ne se met pas à jour
**Solution**: 
1. Vérifiez que la fonction `get_booking_count` existe dans Supabase
2. Vérifiez que l'index `idx_bookings_event_id` existe
