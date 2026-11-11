const HEX = /^#[0-9a-fA-F]{6}$/;

/** Validates a tile. Images must be https URLs; colours must be #rrggbb. Returns a clean tile or null. */
export function cleanTile({ kind, value, caption = "" }) {
  const v = String(value || "").trim();
  const cap = String(caption).trim().slice(0, 120);
  if (kind === "color") return HEX.test(v) ? { kind, value: v.toLowerCase(), caption: cap } : null;
  if (kind === "image") {
    try {
      const u = new URL(v);
      return u.protocol === "https:" ? { kind, value: u.href, caption: cap } : null;
    } catch {
      return null;
    }
  }
  if (kind === "note") return v ? { kind, value: v.slice(0, 280), caption: cap } : null;
  return null;
}
