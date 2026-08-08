# Aether — site

Marketing site for [Aether](https://github.com/Aetherdz/aethercode), the cross-platform terminal AI coding agent. Published on GitHub Pages.

## Pages

- `index.html` — landing page (hero, bento features, providers, quickstart, commands)
- `swarm.html` — Swarm Mission Control: type a mission, watch parallel subagents decompose and merge
- `404.html`, `robots.txt`

## Security model

- **API keys never touch this site.** Keys live only in `~/.config/aether/.env` (0600) on the user's machine, written by the CLI.
- **Strict CSP** on every page: `default-src 'self'`, `script-src 'self'`, `connect-src 'none'`, `object-src 'none'`. No external scripts; only Google Fonts styles.
- **No XSS vectors**: all DOM updates use `textContent`, never `innerHTML`/`eval`.

## Design

Dark OLED, JetBrains Mono, violet-to-cyan gradient. Brand assets (`logo.svg`, `emblem.svg`) live in the [aethercode](https://github.com/Aetherdz/aethercode) repo.

## Local dev

```bash
python3 -m http.server 8000
```

Open http://localhost:8000.