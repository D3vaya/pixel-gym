# WOM Image Optimizer

Sube imágenes, conviértelas a WebP comprimido y descárgalas como ZIP.

## Uso

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Deploy

```bash
vercel deploy
```

## Stack

- Next.js 15 (App Router) + TypeScript
- Sharp para procesamiento (quality 75, effort 6)
- JSZip para empaquetar la descarga
- Tailwind CSS
