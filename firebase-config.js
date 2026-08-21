/**
 * ============================================================
 * CONFIGURATION FIREBASE — Mirichi Mbumba
 * ============================================================
 * 
 * INSTRUCTIONS :
 * 1. Allez sur https://console.firebase.google.com/
 * 2. Créez/sélectionnez votre projet
 * 3. Allez dans Paramètres du projet > Général > Vos applications
 * 4. Copiez vos credentials et remplacez les valeurs ci-dessous
 * 5. Activez Firebase Realtime Database dans le menu Build
 * 
 * IMPORTANT : Ce fichier contient des clés publiques (safe).
 * Ne commitez jamais vos clés SERVICE ACCOUNT.
 * ============================================================
 */

const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Maximum de participants pour l'événement TOUCH UP
const MAX_PARTICIPANTS = 100;

// Nom de l'événement dans Firebase
const EVENT_ID = "touch-up-2026";

// Exposer globalement
window.FIREBASE_CONFIG = FIREBASE_CONFIG;
window.MAX_PARTICIPANTS = MAX_PARTICIPANTS;
window.EVENT_ID = EVENT_ID;
