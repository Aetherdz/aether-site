# Aether Site

Static marketing site for [Aether](https://github.com/Aetherdz/aether), the Rust terminal AI coding agent driven by three models (plan → build → route). Published on GitHub Pages at https://aetherdz.github.io/aether-site.

## Pages

- `index.html` — landing page: hero + install tabs (curl / source), platform buttons, measured stats, terminal demo, quick start, 7-card feature grid, FAQ, honest comparison table.
- `404.html` — custom not-found page matching the same design system.
- `install.sh` — official one-line installer/updater (mirrors `scripts/install.sh` in the main repo).
- `robots.txt` — crawl directives.

## Assets

- `assets/css/style.css` — single stylesheet (dark monochrome palette).
- `assets/fonts/` — self-hosted JetBrains Mono (400 / 700).
- `assets/img/logo.svg` — logo mark.
- `assets/img/demo.gif` — terminal demo recording.

## Security model

- API keys never touch this site. Keys live only in the user's environment / config on their machine, read by the CLI.
- Strict Content Security Policy on every page: `default-src 'self'`, `style-src 'self'`, `font-src 'self'`, `connect-src 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`. No external scripts, no external fonts.
- No XSS vectors: all DOM updates use `textContent`, never `innerHTML` or `eval`.

## Design

Dark monochrome treatment (user-directed): `#0A0A0A` background, `#F5F5F5` text,
ink `#111111` marks on `#F5F5F5` tiles, `#A3A3A3` muted text, hairline `#2E2E2E`
borders. No chromatic color anywhere — the palette is exactly 9 tokens. Code uses
self-hosted JetBrains Mono. No emojis.

## Local development

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## The CLI

The Aether CLI itself lives in the [aether](https://github.com/Aetherdz/aether) repository.
