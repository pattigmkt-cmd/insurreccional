import { defineConfig } from "astro/config";
import tailwind from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

// TODO: actualizar SITE cuando se defina dominio propio.
// Por defecto asume deploy en Cloudflare Pages (insurreccional.pages.dev).
// Para GitHub Pages user-site: site = "https://<user>.github.io", base = "/insurreccional".
const SITE = process.env.SITE_URL ?? "https://insurreccional.pages.dev";

export default defineConfig({
  site: SITE,
  trailingSlash: "ignore",
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwind()],
  },
});
