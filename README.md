# Insurreccional

Plataforma editorial de Dominique Alexia — criterio real sobre branding. No logos, no seguidores de Instagram.

Para profesionales del sector quemados — diseñadoras, community managers, social media managers a los que las empresas les piden hacer de todo. Comunidad primero, clientes después.

## Stack

- **Astro 6** — SSG estático, cero runtime JS por default
- **Tailwind v4** — design system via `@theme`
- **Content Collections** — Markdown en `src/content/blog/`
- **@fontsource** — Playfair Display (serif editorial), DM Sans (body), JetBrains Mono (meta)

## Desarrollo

```bash
pnpm install
pnpm dev        # localhost:4321
pnpm build      # estático a dist/
pnpm preview    # preview del build
```

## Escribir un post

Crear archivo nuevo en `src/content/blog/<slug>.md` con frontmatter:

```yaml
---
title: "Título del post"
description: "Resumen breve — sale en listings y meta description."
pubDate: 2026-04-23
category: "Criterio"
kicker: "Bajada opcional para el listing"
readingMinutes: 7
featured: false
---

Contenido Markdown acá.
```

## Deploy

Pensado para Cloudflare Pages (conectás el repo de GitHub y auto-deploya en cada push a `main`). También corre en GitHub Pages ajustando `base` y `site` en `astro.config.mjs`.

## Escalera de contenido

1. Blog (acá)
2. YouTube
3. Podcast

El blog es la base. Todo lo demás sale desde acá.
