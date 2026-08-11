# Guide d'installation Firebase pour le système de réservation

## Étape 1: Créer un compte Firebase et un projet

1. Allez sur https://console.firebase.google.com/
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Ajouter un projet" ou "Create project"
4. Nommez le projet: `mirichi-events` (ou autre nom)
5. Cliquez sur "Continuer"
6. Désactivez Google Analytics (pas nécessaire pour notre usage)
7. Cliquez sur "Créer un projet"
8. Attendez la création du projet (quelques secondes)

## Étape 2: Activer Firebase Realtime Database

1. Dans le menu de gauche, cliquez sur "Build" puis "Realtime Database"
2. Cliquez sur "Créer une base de données" ou "Create Database"
3. Choisissez l'emplacement: Sélectionnez une région proche (ex: europe-west1)
4. Cliquez sur "Suivant"
5. **IMPORTANT**: Choisissez "Démarrer en mode test" (Start in test mode)
   - Cela permet l'accès sans authentification pour le développement
   - Vous pourrez ajouter des règles de sécurité plus tard
6. Cliquez sur "Activer"

## Étape 3: Obtenir les credentials Firebase

1. Cliquez sur l'icône d'engrenage ⚙️ à côté de "Project Overview" dans le menu
2. Sélectionnez "Paramètres du projet" (Project settings)
3. Allez dans l'onglet "Général" (General)
4. Faites défiler jusqu'à la section "Vos applications" (Your apps)
5. Cliquez sur le bouton web (</>) pour ajouter une application web
6. Donnez un surnom: `mirichi-website`
7. **NE PAS** cocher "Firebase Hosting"
8. Cliquez sur "Enregistrer l'application" (Register app)
9. Copiez les valeurs suivantes:
   - `apiKey`
   - `authDomain`
   - `databaseURL`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## Étape 4: Configurer les règles de sécurité (IMPORTANT pour la production)

1. Dans Realtime Database, cliquez sur l'onglet "Règles" (Rules)
2. Remplacez les règles par défaut par ces règles sécurisées:
```json
{
  "rules": {
    "bookings": {
      ".read": true,
      ".write": "newData.hasChildren(['fullName', 'email', 'ticketCode', 'eventId'])",
      "$bookingId": {
        ".write": "!data.exists()" // Empêche la modification de réservations existantes
      }
    },
    "checkedIn": {
      ".read": true,
      ".write": "newData.hasChildren(['timestamp'])"
    },
    "config": {
      ".read": true,
      ".write": "auth != null" // Seuls les utilisateurs authentifiés peuvent modifier la config
    }
  }
}
```
3. Cliquez sur "Publier" (Publish)

**Explication des règles:**
- **bookings**: Lecture publique (nécessaire pour le compteur), écriture contrôlée avec validation
- **checkedIn**: Lecture publique, écriture avec validation du timestamp
- **config**: Lecture publique, écriture réservée aux utilisateurs authentifiés (admin)

## Étape 4.5: Créer un compte admin dans Firebase Authentication

1. Dans le menu de gauche, cliquez sur "Build" puis "Authentication"
2. Cliquez sur "Commencer" (Get Started)
3. Cliquez sur l'onglet "Utilisateurs" (Users)
4. Cliquez sur "Ajouter un utilisateur" (Add user)
5. Entrez:
   - **Email**: Votre email admin (ex: admin@mirichimbumba.com)
   - **Mot de passe**: Un mot de passe sécurisé
6. Cliquez sur "Créer un utilisateur"

**Note**: Gardez ces identifiants en sécurité, ils permettent de modifier le nombre maximum de participants.

## Étape 5: Envoyez-moi les credentials

Une fois que vous avez les credentials, envoyez-les-moi sous cette forme:

```
apiKey: "VOTRE_API_KEY"
authDomain: "VOTRE_AUTH_DOMAIN"
databaseURL: "VOTRE_DATABASE_URL"
projectId: "VOTRE_PROJECT_ID"
storageBucket: "VOTRE_STORAGE_BUCKET"
messagingSenderId: "VOTRE_MESSAGING_SENDER_ID"
appId: "VOTRE_APP_ID"
```

## Ce que je ferai ensuite

Une fois que j'aurai vos credentials:
1. J'ajouterai le SDK Firebase dans events.html et checkin.html
2. Je remplacerai localStorage par Firebase Realtime Database
3. J'ajouterai la synchronisation en temps réel
4. Je testerai le système
5. Je déploierai la version finale

## Avantages de Firebase

- ✅ Synchronisation automatique entre tous les utilisateurs
- ✅ Mise à jour en temps réel du compteur de places
- ✅ Pas de problèmes de CSP
- ✅ Intégration simple via CDN
- ✅ Gratuit pour petit usage
- ✅ Les données sont persistantes sur le cloud

## Structure de données Firebase

```
mirichi-events/
├── bookings/           # Toutes les réservations
│   ├── {bookingId}/    # Chaque réservation
│   │   ├── fullName
│   │   ├── email
│   │   ├── phone
│   │   ├── whatsapp
│   │   ├── message
│   │   ├── ticketCode
│   │   ├── bookingDate
│   │   └── eventId
├── checkedIn/          # Tickets scannés
│   ├── {ticketCode}/   # Chaque ticket scanné
│   │   ├── timestamp
│   │   └── bookingId
└── config/             # Configuration
    ├── maxParticipants # Nombre max de participants
    └── eventId         # ID de l'événement actuel
```
