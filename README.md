# Aether — site

Marketing site for [Aether](https://github.com/Aetherdz/aethercode), the cross-platform terminal AI coding agent. Published on GitHub Pages.

## Pages

- `index.html` — landing page (hero, bento features, providers, quickstart, commands)
- `swarm.html` — Swarm Mission Control: type a mission, watch parallel subagents decompose and merge
- `login.html` — sign-in / sign-up demo (client-side only)
- `connect.html` — connect providers: generates `aether login <provider>` commands
- `404.html`, `robots.txt`

## Security model

- **API keys never touch this site.** The connect page only generates terminal commands (`aether login openai`). Keys are written by the CLI into `~/.config/aether/.env` (0600) on the user's machine.
- **No passwords stored.** The auth demo persists only `{ name, email }` in localStorage, purely to demo the session flow. The password field is validated and discarded.
- **Strict CSP** on every page: `default-src 'self'`, `script-src 'self'`, `connect-src 'none'`, `object-src 'none'`. No external scripts; only Google Fonts styles.
- **No XSS vectors**: all DOM updates use `textContent`, never `innerHTML`/`eval`.

## Design

Dark OLED, JetBrains Mono, violet-to-cyan gradient. Brand assets (`logo.svg`, `emblem.svg`) live in the [aethercode](https://github.com/Aetherdz/aethercode) repo.

## Local dev

```bash
cd docs
python3 -m http.server 8000
```

Open http://localhost:8000.
