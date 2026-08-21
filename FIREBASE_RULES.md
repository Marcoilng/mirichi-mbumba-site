# Règles Firebase Realtime Database — Mirichi Events

## Règles actuelles (à copier dans Firebase Console → Realtime Database → Règles)

```json
{
  "rules": {
    "touchup": {
      "bookings": {
        ".read": true,
        ".write": "newData.hasChildren(['fullName', 'email', 'ticketCode', 'bookingDate'])",
        ".validate": "newData.child('fullName').val().length > 0 && newData.child('email').val().length > 0",
        "$bookingId": {
          ".write": "!data.exists() || newData.child('ticketCode').val() == data.child('ticketCode').val()"
        }
      },
      "checkins": {
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

**Important :** Ajoutez le nœud `checkins` si ce n'est pas encore fait — il est utilisé par `checkin.html` pour enregistrer les validations à l'entrée.

---

## Structure des données dans votre projet Firebase `mirichi-events`

```
mirichi-events (Realtime Database)
└── touchup/
    ├── bookings/             ← Réservations (depuis events.html)
    │   └── {id auto}/
    │       ├── fullName
    │       ├── email
    │       ├── phone
    │       ├── city
    │       ├── profession
    │       ├── motivation
    │       ├── expectations
    │       ├── newsletter     (true/false)
    │       ├── ticketCode     (ex: TU-2026-12345)
    │       ├── eventId        ("touchup")
    │       ├── eventTitle     ("TOUCH UP")
    │       ├── bookingDate    (ISO 8601)
    │       └── status         ("confirmed")
    │
    └── checkins/             ← Validations à l'entrée (depuis checkin.html)
        └── {id auto}/
            ├── ticketCode    ← Code du ticket validé
            ├── bookingId     ← Référence vers bookings
            ├── fullName
            ├── email
            ├── timestamp     (ISO 8601)
            └── eventId       ("touchup")
```

---

## Fichiers modifiés

| Fichier | Chemin utilisé |
|---------|---------------|
| `firebase-config.js` | Credentials réels + chemins `touchup/bookings` et `touchup/checkins` |
| `events.html` | Lit/écrit sur `touchup/bookings` |
| `checkin.html` | Lit `touchup/bookings`, écrit sur `touchup/checkins` |

---

## Test du système

1. Ouvrez `events.html` → le badge doit passer en **vert "Temps réel actif"**
2. Faites une réservation → vérifiez dans Firebase Console que le record apparaît sous `touchup/bookings/`
3. Le compteur se met à jour instantanément sur **tous les onglets ouverts**
4. Ouvrez `checkin.html` → mot de passe : `mirichi2026`
5. Scannez un QR code → le check-in apparaît dans `touchup/checkins/`
