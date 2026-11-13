# Design: Atelier (v3)
Warm paper + deep pine + brass. One accent (pine #17614F), one highlight (brass #B5812F), colour for status only.
- Tokens in `src/index.css` (:root / html.dark): --paper #F7F3EA, --surface #FFF, --line #E6DFD0, --ink #1F2421, --brand, --brass, --panel (warm sand for sidebar/hero/CTA; --panel = warm charcoal for dark hero cards).
- Type: Readex Pro (headings, `font-display`) + IBM Plex Sans Arabic (body) + Inter; bundled via @fontsource (no CDN).
- Radius 8/12/18/24; soft warm shadows; hairline borders; measuring-tape `.ruler`; `.grain` texture on hero panels.
- Shell: deep-pine sidebar (sand) with brass active marker; landing hero = pine stage with floating calculator; numbered pillars; highlighted pricing plan = pine card + brass CTA.
- Mobile: BottomNav, unified type scale, tables as labelled cards. Dark mode: tokens + scripts/gen-dark.py (rerun after palette changes).
