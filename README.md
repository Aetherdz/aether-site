# Aether Site

Static marketing site for [Aether](https://github.com/Aetherdz/aether), the Rust terminal AI coding agent driven by three models (plan → build → route). Published on GitHub Pages at https://aetherdz.github.io/aether-site.

## Pages

- `index.html` — landing page: 3-model agent loop, bento feature grid, install tabs (curl / cargo / git clone / Termux), CLI command list, FAQ.
- `404.html` — custom not-found page.
- `install.sh` — POSIX one-line installer (detects Termux, uses `pkg install rust` there; rustup elsewhere).
- `robots.txt` — crawl directives.

## Brand assets

- `logo.svg` — full wordmark.
- `emblem.svg` — square emblem.

## Security model

- API keys never touch this site. Keys live only in the user's environment / config on their machine, read by the CLI.
- Strict Content Security Policy on every page: `default-src 'self'`, `script-src 'self'`, `style-src 'self'`, `font-src 'self'`, `connect-src 'none'`, `object-src 'none'`. No external scripts, no external fonts.
- No XSS vectors: all DOM updates use `textContent`, never `innerHTML` or `eval`.

## Design

Color palette mirrors opencode.ai / jcode.sh: white background (`#ffffff`),
`#f5f5f7` surfaces, ink `#1d1d1f` text, and a blue accent (`#007aff`).
The terminal mock and install code blocks keep the opencode dark scheme
(`#0c0c0e` / `#161618`). Body text uses the system sans stack; code uses
IBM Plex Mono / JetBrains Mono / system mono. No emojis.

## Local development

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## The CLI

The Aether CLI itself lives in the [aether](https://github.com/Aetherdz/aether) repository.
