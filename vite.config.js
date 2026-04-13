import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        importScripts: ["/push-sw.js"],
        cleanupOutdatedCaches: true,

        // 🔥 CLAVE: excluir admin completamente
        navigateFallbackDenylist: [
          /^\/api/,
          /^\/backoffice/   // ✅ FIX CRÍTICO
        ],

        runtimeCaching: [
          {
            urlPattern: /^\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },

      devOptions: {
        enabled: false,
      },

      manifest: {
        id: "teleremate-root",
        name: "TeleRemate App",
        short_name: "TeleRemate",
        description:
          "La plataforma líder en subastas y ventas online.",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",

        start_url: "/",     // ✅ OK
        scope: "/",         // ✅ OK

        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});