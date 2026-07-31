# DESIGN — Product Site portfolio

**Lane:** `product-site` · Class C  
**Live:** https://km-it-ops.github.io/  
**Content SoT:** [`content/BRIEF.md`](content/BRIEF.md)

## Direction

Iridescent scrutiny lens (R3F) as signature. After-hero: pinned lens stage (Work → Creds → Ops) plus elevated horizontal work cinema in the same dark/aurora material language. Sora only (italic emphasis — no serif injection).

## Tokens

```css
--paper: #f5f5f7;
--ink: #1d1d1f;
--void: #06090f;
--font: "Sora", system-ui, sans-serif;
```

## Spine

1. Hero — lens + name + line + Resume/GitHub  
2. Pinned lens stage  
3. Work cinema  
4. Quiet credentials  
5. Experience  
6. Contact  

## Deploy

- Vite `base: '/'`, `build.outDir: 'docs'`
- GitHub Pages source: `/docs` on `main`
- Gate: `npm run build` → `npm run preview` before push
- Never feature AgentForge Pages demo (404)
