const KEY = "miyar:theme";
export const getTheme = () => {
  try { return localStorage.getItem(KEY) || "light"; } catch { return "light"; }
};
export const applyTheme = (t = getTheme()) => {
  const root = document.documentElement;
  root.classList.toggle("dark", t === "dark");
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute("content", t === "dark" ? "#0A0F14" : "#0E2A47");
};
export const setTheme = (t) => {
  try { localStorage.setItem(KEY, t); } catch { /* storage unavailable */ }
  applyTheme(t);
};
