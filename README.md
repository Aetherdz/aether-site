# Aether Site

Static marketing site for [Aether](https://github.com/aethercode/aether-cli), the cross-platform terminal AI coding agent. Published on GitHub Pages at https://aetherdz.github.io/aether-site.

## Pages

- `index.html` — landing page: hero, bento feature grid, a table of 20+ CLI commands, and provider listings.
- `swarm.html` — "Swarm Mission Control": describe a mission and watch parallel subagents decompose and merge.
- `404.html` — custom not-found page.
- `robots.txt` — crawl directives.

## Brand assets

- `logo.svg` — full wordmark, 1200x280.
- `emblem.svg` — square emblem, 1024x1024.

Both assets are also maintained in the [aether-cli](https://github.com/aethercode/aether-cli) repository under `docs/`.

## Security model

- API keys never touch this site. Keys live only in `~/.config/aether/.env` (0600) on the user's machine, written by the CLI.
- Strict Content Security Policy on every page: `default-src 'self'`, `script-src 'self'`, `connect-src 'none'`, `object-src 'none'`. No external scripts; the only third-party resource is Google Fonts.
- No XSS vectors: all DOM updates use `textContent`, never `innerHTML` or `eval`.

## Design

Dark OLED background, JetBrains Mono typography, violet-to-cyan gradient accents, deep navy `#0a0a14` palette.

## Local development

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## The CLI

The Aether CLI itself lives in the [aether-cli](https://github.com/aethercode/aether-cli) repository.
