export const CRITERIA = [
  { key: "DELIVERY_TIME", label: "Delivery time" },
  { key: "RESPONSE_TIME", label: "Response time" },
  { key: "FLEXIBILITY", label: "Flexibility" },
  { key: "QUALITY_OF_WORK", label: "Quality of work" },
  { key: "PRICING_VALUE", label: "Pricing / value" },
  { key: "COMMUNICATION", label: "Communication" },
  { key: "SAMPLE_QUALITY", label: "Sample quality" },
  { key: "FOLLOWED_THROUGH", label: "Followed through" },
];

export const CRITERIA_KEYS = CRITERIA.map((c) => c.key);

export function labelFor(key) {
  return CRITERIA.find((c) => c.key === key)?.label ?? key;
}
