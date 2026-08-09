#!/usr/bin/env sh
# Aether — one-line installer.
#   curl -fsSL https://aetherdz.github.io/aether-site/install.sh | sh
# Installs the `aether` binary. Requires Rust (installs rustup, or `pkg
# install rust` on Termux, when missing).
set -eu

# ---- helpers ---------------------------------------------------------------
say()  { printf '\033[1;32m[aether]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[aether]\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31m[aether]\033[0m %s\n' "$*" >&2; exit 1; }

# ---- platform detection ----------------------------------------------------
if [ -n "${TERMUX_VERSION:-}" ] || [ -d "$PREFIX/bin" ] 2>/dev/null && [ -n "${PREFIX:-}" ]; then
  IS_TERMUX=1
else
  IS_TERMUX=0
fi

# ---- rust detection ---------------------------------------------------------
if command -v cargo >/dev/null 2>&1; then
  say "cargo found: $(cargo --version | head -1)"
  HAVE_CARGO=1
else
  warn "cargo not found — installing a Rust toolchain."
  HAVE_CARGO=0
fi

if [ "$HAVE_CARGO" = "0" ]; then
  if [ "$IS_TERMUX" = "1" ]; then
    command -v pkg >/dev/null 2>&1 || die "pkg not found — is this Termux?"
    say "installing rust via pkg (rustup is not supported on Termux) …"
    pkg install -y rust
    command -v cargo >/dev/null 2>&1 || die "pkg rust install failed — try: pkg install rust"
  elif command -v curl >/dev/null 2>&1; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
  elif command -v wget >/dev/null 2>&1; then
    wget -qO- https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
  else
    die "neither curl nor wget found — install curl or wget first, then re-run."
  fi
  # shellcheck disable=SC1090
  . "$HOME/.cargo/env" 2>/dev/null || true
  command -v cargo >/dev/null 2>&1 || die "Rust install failed — re-run manually."
  say "cargo ready: $(cargo --version | head -1)"
fi

# ---- install ----------------------------------------------------------------
# The crate is published as `aetherdz-cli`; the binary it ships is `aether`.
say "installing aetherdz-cli (binary: aether) from crates.io …"
cargo install aetherdz-cli --locked 2>/dev/null || cargo install aetherdz-cli

# ---- PATH -------------------------------------------------------------------
CARGO_BIN="${CARGO_HOME:-$HOME/.cargo}/bin"
if command -v aether >/dev/null 2>&1; then
  say "done — run \`aether\` to start."
elif printf '%s' "$PATH" | grep -q "$CARGO_BIN"; then
  say "done — run \`aether\` to start."
else
  warn "add $CARGO_BIN to your PATH, then run \`aether\`:"
  printf '  export PATH="$HOME/.cargo/bin:$PATH"\n'
fi

say "first run: \`aether ask \"hello\"\`  (the free zen provider works with no API key)"
