// Refined-5 design system tokens
export const COLORS = {
  // Backgrounds
  bg: "#F6F3EC",        // cream — page bg
  cream: "#F6F3EC",
  cream2: "#EFEADD",    // secondary surface
  surface: "#FFFFFF",   // card
  card: "#FFFFFF",
  surface2: "#EFEADD",  // legacy alias → cream-2

  // Borders / lines
  border: "rgba(26, 23, 20, 0.08)",
  border2: "rgba(26, 23, 20, 0.14)",
  line: "rgba(26, 23, 20, 0.08)",
  line2: "rgba(26, 23, 20, 0.14)",

  // Text
  text: "#1A1714",
  ink: "#1A1714",
  text2: "#3A342D",
  ink2: "#3A342D",
  muted: "#75695B",

  // Brand (warm earth-brown)
  brand: "#8B6A3A",
  brandDeep: "#6B4F24",
  brandTint: "#F3EAD9",
  amber: "#8B6A3A",     // legacy alias → brand

  // Accent palette
  olive: "#4F6B3A",
  oliveTint: "#E6EDD9",
  orange: "#C4622D",
  plum: "#6B3A4F",
  gold: "#C9A55A",

  // Semantic
  green: "#4F6B3A",     // legacy alias → olive
  greenBg: "#E6EDD9",   // legacy alias → olive-tint
  greenBorder: "#B8C99D",
  whatsapp: "#25D366",

  // Foreground on accent
  onAccent: "#FFFFFF",
};

// Font family CSS variables (loaded in app/layout.jsx via next/font)
export const FONTS = {
  sans: "var(--font-sans), system-ui, -apple-system, sans-serif",
  serif: 'var(--font-serif), "Source Serif Pro", Georgia, serif',
  mono: "var(--font-mono), ui-monospace, monospace",
};
