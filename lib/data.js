// Categories are intentionally static — they drive UI dropdowns and filter
// pills, and rarely change. Supplier data lives in Postgres (see lib/suppliers.js
// and prisma/schema.prisma).
export const CATEGORIES = [
  "All",
  "Packaging",
  "Apparel",
  "Nutraceuticals",
  "Food & Bev",
  "Print",
  "Gifting",
];
