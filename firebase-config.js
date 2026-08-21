/**
 * ============================================================
 * CONFIGURATION FIREBASE — Mirichi Mbumba Events
 * Projet : mirichi-events
 * ============================================================
 * ATTENTION : Ce fichier contient des clés API publiques (safe
 * pour le frontend). Ne commitez jamais vos clés SERVICE ACCOUNT.
 * ============================================================
 */

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDpdm8el1KWM_WD42HMExRCvFp9ySf4fvI",
    authDomain: "mirichi-events.firebaseapp.com",
    databaseURL: "https://mirichi-events-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mirichi-events",
    storageBucket: "mirichi-events.firebasestorage.app",
    messagingSenderId: "582412284374",
    appId: "1:582412284374:web:3c57614741e8a595f13477"
};

// ─── Paramètres de l'événement ───────────────────────────────
// Chemin Firebase : touchup/bookings   (défini dans vos règles)
const FIREBASE_BOOKINGS_PATH = "touchup/bookings";
const FIREBASE_CHECKINS_PATH = "touchup/checkins";

// Nombre maximum de participants
const MAX_PARTICIPANTS = 100;

// Exposer globalement
window.FIREBASE_CONFIG = FIREBASE_CONFIG;
window.FIREBASE_BOOKINGS_PATH = FIREBASE_BOOKINGS_PATH;
window.FIREBASE_CHECKINS_PATH = FIREBASE_CHECKINS_PATH;
window.MAX_PARTICIPANTS = MAX_PARTICIPANTS;
