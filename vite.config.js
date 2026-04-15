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

      includeAssets: ['manifest.webmanifest', 'manifest-admin.json'],

      devOptions: {
        enabled: false,
      },

      manifest: false,

    }),
  ],
});