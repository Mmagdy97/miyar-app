// Visitor country from Vercel's edge (IP-based, no third-party service, no prompt).
// Used to show the price list of the visitor's country only.
export default function handler(req, res) {
  const country = String(req.headers["x-vercel-ip-country"] || "").toUpperCase().slice(0, 2) || null;
  res.setHeader("Cache-Control", "private, no-store");
  res.status(200).json({ country });
}
