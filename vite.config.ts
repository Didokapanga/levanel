import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Travel Agency",
        short_name: "TravelApp",
        description: "Offline-first travel agency PWA",
        theme_color: "#0f172a",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "410x410",
            // sizes: "192x192",
            type: "image/png"
          },
          {
            // src: "/pwa-512x512.png",
            src: "/pwa-512x512.png",
            sizes: "410x410",
            type: "image/png"
          }
        ]
      },
      devOptions: {
        enabled: true, // pour tester la PWA en dev
      },
    })
  ]
});
