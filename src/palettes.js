// Office colour palettes. A palette is one main colour; the rest of the shades are derived from it.
export const PALETTES = [
  { id: "teal", color: "#2E6F73" },
  { id: "indigo", color: "#3F4FB0" },
  { id: "forest", color: "#2F7A44" },
  { id: "burgundy", color: "#9B2C4A" },
  { id: "slate", color: "#475569" },
  { id: "bronze", color: "#8A5A2B" },
  { id: "terra", color: "#B5541A" },
];

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (a) => "#" + a.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => hex(rgb(a).map((v, i) => v * (1 - t) + rgb(b)[i] * t));
const lum = (h) => {
  const [r, g, b] = rgb(h).map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
/** WCAG contrast of white text on this colour. */
export const contrastWhite = (h) => 1.05 / (lum(h) + 0.05);
export const isValidColor = (h) => /^#[0-9a-fA-F]{6}$/.test(h || "") && contrastWhite(h) >= 4.5;

/** Shades derived from the main colour: p1 main, p0 deep, p2 hover, p3 panel, p4 soft background. */
export const shades = (main) => ({
  p1: main,
  p0: mix(main, "#000000", 0.5),
  p2: mix(main, "#000000", 0.2),
  p3: mix(main, "#000000", 0.35),
  p4: mix(main, "#ffffff", 0.88),
});

/** Apply an office palette. "teal" (default) clears the override. */
export function applyPalette(id = "teal", custom = "") {
  const root = document.documentElement;
  const main = id === "custom" ? custom : PALETTES.find((p) => p.id === id)?.color;
  const vars = ["p0", "p1", "p2", "p3", "p4"];
  if (!main || id === "teal" || !isValidColor(main)) {
    root.removeAttribute("data-palette");
    vars.forEach((v) => root.style.removeProperty("--" + v));
    return;
  }
  root.setAttribute("data-palette", id);
  Object.entries(shades(main)).forEach(([k, v]) => root.style.setProperty("--" + k, v));
}
