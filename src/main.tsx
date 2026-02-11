import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';
import { registerSW } from "virtual:pwa-register";

// ---------------------------------------------------
// Enregistrement du Service Worker
// ---------------------------------------------------
// updateSW est déclaré pour pouvoir déclencher manuellement
// la mise à jour si nécessaire, mais n'est pas utilisé tout de suite.
// Le warning TS est géré avec un commentaire ESLint.
/* eslint-disable @typescript-eslint/no-unused-vars */
registerSW({
  onNeedRefresh() {
    console.log("Nouvelle version disponible. Rechargez pour mettre à jour !");
  },
  onOfflineReady() {
    console.log("Application prête à fonctionner hors ligne.");
  },
});

/* eslint-enable @typescript-eslint/no-unused-vars */

// ---------------------------------------------------
// Détection état réseau pour UI offline-first
// ---------------------------------------------------
const handleOnlineStatus = () => {
  if (navigator.onLine) {
    console.log("Connecté à internet.");
    // Ici tu peux déclencher la synchronisation IndexedDB -> serveur
  } else {
    console.log("Hors ligne. L'application fonctionne avec les données locales.");
  }
};

// Événements réseau
window.addEventListener("online", handleOnlineStatus);
window.addEventListener("offline", handleOnlineStatus);

// Initial check
handleOnlineStatus();

// ---------------------------------------------------
// Render React
// ---------------------------------------------------
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);