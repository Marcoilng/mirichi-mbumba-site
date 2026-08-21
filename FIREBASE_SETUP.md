# Guide complet d'intégration Firebase — Réservations en temps réel

## Vue d'ensemble

Firebase Realtime Database est maintenant intégré dans `events.html`. Les réservations sont stockées directement dans Firebase et le compteur de places se met à jour **en temps réel** sur tous les appareils simultanément.

---

## Étape 1 : Créer un projet Firebase

1. Allez sur https://console.firebase.google.com/
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Ajouter un projet"**
4. Nom du projet : `mirichi-events` (ou autre nom de votre choix)
5. Désactivez Google Analytics (pas nécessaire)
6. Cliquez sur **"Créer un projet"** et attendez quelques secondes

---

## Étape 2 : Activer Firebase Realtime Database

1. Dans le menu de gauche → **Build** → **Realtime Database**
2. Cliquez sur **"Créer une base de données"**
3. Choisissez la région : **europe-west1** (la plus proche de Kinshasa)
4. Choisissez **"Démarrer en mode test"** pour commencer
5. Cliquez sur **"Activer"**

---

## Étape 3 : Obtenir vos credentials

1. Cliquez sur l'icône ⚙️ → **Paramètres du projet**
2. Onglet **"Général"** → section **"Vos applications"**
3. Cliquez sur le bouton web `</>` → donnez un surnom : `mirichi-website`
4. **NE PAS** cocher Firebase Hosting
5. Copiez les valeurs suivantes :

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",       // ← TRÈS IMPORTANT : doit contenir votre databaseURL
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

---

## Étape 4 : Configurer les credentials dans votre projet

Ouvrez le fichier **`firebase-config.js`** (à la racine du projet) et remplacez les valeurs :

```javascript
const FIREBASE_CONFIG = {
    apiKey: "VOTRE_API_KEY_ICI",
    authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://VOTRE_PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "VOTRE_PROJECT_ID",
    storageBucket: "VOTRE_PROJECT_ID.appspot.com",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
};

const MAX_PARTICIPANTS = 100;   // ← Modifiez le nombre max de participants ici
const EVENT_ID = "touch-up-2026";  // ← ID unique de l'événement
```

**Note importante :** Si votre `databaseURL` n'est pas visible dans la config, allez dans :
`Realtime Database` → La barre du haut affiche l'URL : `https://PROJET-default-rtdb.REGION.firebasedatabase.app`

---

## Étape 5 : Configurer les règles de sécurité

Dans **Realtime Database** → onglet **"Règles"**, remplacez par :

```json
{
  "rules": {
    "bookings": {
      "touch-up-2026": {
        ".read": true,
        ".write": "newData.hasChildren(['fullName', 'email', 'ticketCode', 'eventId'])",
        "$bookingId": {
          ".write": "!data.exists()"
        }
      }
    },
    "checkins": {
      "touch-up-2026": {
        ".read": true,
        ".write": "newData.hasChildren(['ticketCode', 'timestamp'])",
        "$checkinId": {
          ".write": "!data.exists()"
        }
      }
    }
  }
}
```

**Explication :**
- **`bookings/.read: true`** → Nécessaire pour le compteur temps réel visible par tous
- **`bookings/.write`** → Écriture uniquement si les champs requis sont présents
- **`checkins`** → Nœud dédié aux validations à l'entrée (checkin.html)
- **`!data.exists()`** → Chaque entrée ne peut être écrite qu'une seule fois

Cliquez sur **"Publier"** pour appliquer les règles.

---

## Étape 6 : Vérifier le fonctionnement

1. Ouvrez `events.html` dans votre navigateur
2. Le badge en haut à droite doit passer de **"Connexion..."** à **"Temps réel actif"** (point vert clignotant)
3. Le compteur doit afficher **0 réservations** et **100 places restantes**
4. Testez une réservation → le compteur doit se mettre à jour instantanément

---

## Structure des données dans Firebase

```
mirichi-events (projet Firebase)
└── bookings/
    └── touch-up-2026/        ← Toutes les réservations de l'événement
        ├── {bookingId}/      ← ID auto-généré par Firebase
        │   ├── bookingId     ← Même valeur que la clé parent
        │   ├── fullName      ← Nom complet du participant
        │   ├── email         ← Email
        │   ├── phone         ← Téléphone
        │   ├── city          ← Ville
        │   ├── profession    ← Profession (optionnel)
        │   ├── motivation    ← Motivation pour participer
        │   ├── expectations  ← Attentes (optionnel)
        │   ├── newsletter    ← true/false
        │   ├── ticketCode    ← Code unique ex: TU-2026-12345
        │   ├── eventId       ← "touch-up-2026"
        │   ├── eventTitle    ← "TOUCH UP"
        │   ├── bookingDate   ← ISO timestamp
        │   └── status        ← "confirmed"
        ...
```

---

## Comportement en temps réel

Une fois configuré, voici ce qui se passe :

| Situation | Comportement |
|-----------|-------------|
| Quelqu'un réserve | Tous les visiteurs voient le compteur se mettre à jour instantanément |
| Places = 15 ou moins | Bannière orange "Dernières places" apparaît |
| Places = 0 (100 réservations) | Bannière rouge "Complet", bouton désactivé |
| Perte connexion internet | Badge passe en "Reconnexion...", reprend dès reconnexion |
| Firebase non configuré | Modal d'aide apparaît avec les instructions |

---

## Modifier la limite de participants

Pour changer de 100 à une autre valeur, modifiez dans `firebase-config.js` :

```javascript
const MAX_PARTICIPANTS = 150;  // ← Modifiez ici
```

---

## Voir les réservations (admin)

Dans la console Firebase → **Realtime Database** → **Données**, vous verrez toutes les réservations en temps réel avec la structure définie ci-dessus.

---

## Checkin (optionnel)

Le fichier `checkin.html` peut être mis à jour pour lire depuis Firebase.
Utilisez le même chemin `bookings/touch-up-2026` pour accéder à toutes les réservations lors du scan de tickets à l'entrée.
