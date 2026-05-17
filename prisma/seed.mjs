import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const photos = (seed, n = 5) =>
  Array.from({ length: n }, (_, i) => `https://picsum.photos/seed/${seed}-${i}/900/560`);

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const SUPPLIERS = [
  {
    legacyId: 1,
    name: "Hitchhiking Vespa",
    handle: "@hitchhikingvespa",
    tagline: "Bags & Travel Accessories",
    category: "Apparel",
    location: "Mumbai",
    moq: 50,
    lowMoq: true,
    lead: "21 days",
    tags: ["Leather", "Canvas", "Faux Leather", "Nylon"],
    about:
      "Manufacturers of bags and travel accessories across materials. Producing for multiple Indian and international D2C brands alongside their own label. Small batch friendly.",
    offerings: [
      { name: "Custom Leather Bags", moq: "50 units", lead: "21 days" },
      { name: "Canvas Totes", moq: "100 units", lead: "14 days" },
      { name: "Travel Accessories", moq: "50 units", lead: "21 days" },
    ],
    whatsapp: "919999999991",
    accent: "#D4A853",
    yearsInBusiness: 8,
    ordersShipped: 240,
    certifications: ["OEKO-TEX", "SA8000", "MSME"],
    rating: 4.8,
    reviewCount: 156,
    reviews: [
      { author: "Priya Menon", brand: "Casa Lima", rating: 5, text: "Pilot run of 50 bags came in 18 days. Quality matched the sample exactly, no surprises." },
      { author: "Rohan Bedi", brand: "Forest Co.", rating: 5, text: "They figured out the leather grade for my budget. Saved me a sourcing trip to Kanpur." },
      { author: "Niharika S.", brand: "Wayward Goods", rating: 4, text: "Communication on WhatsApp is fast. Will reorder." },
    ],
    photos: photos("vespa", 5),
    video: { url: SAMPLE_VIDEO, thumbnail: "https://picsum.photos/seed/vespa-video/900/560", duration: "0:52" },
  },
  {
    legacyId: 2,
    name: "Print Panda",
    handle: "@printpanda",
    tagline: "Packaging & Custom Print",
    category: "Print",
    location: "Delhi, Okhla",
    moq: 200,
    lowMoq: false,
    lead: "12 days",
    tags: ["Corrugated", "Rigid Box", "Labels", "Flexible"],
    about:
      "D2C packaging, space branding and custom print. Works with brands on the full unboxing experience — not just boxes.",
    offerings: [
      { name: "Custom Mailer Boxes", moq: "200 units", lead: "12 days" },
      { name: "Product Labels", moq: "1000 units", lead: "7 days" },
      { name: "Space Branding", moq: "Project basis", lead: "Discuss" },
    ],
    whatsapp: "919999999992",
    accent: "#C4704A",
    yearsInBusiness: 12,
    ordersShipped: 580,
    certifications: ["FSC", "ISO 9001", "BRC", "Sedex"],
    rating: 4.6,
    reviewCount: 312,
    reviews: [
      { author: "Anjali Rao", brand: "Skinscape", rating: 5, text: "Redesigned our entire unboxing — boxes, inserts, tissue, tape. One vendor handled all of it." },
      { author: "Kabir Shah", brand: "Brewmore", rating: 4, text: "QA on the labels was tight. No misprints across 4 batches of 1000 each." },
      { author: "Vivek N.", brand: "Clay & Curd", rating: 5, text: "Pricing held steady through 3 reorders. Useful when planning gross margin." },
    ],
    photos: photos("panda", 6),
    video: { url: SAMPLE_VIDEO, thumbnail: "https://picsum.photos/seed/panda-video/900/560", duration: "1:08" },
  },
  {
    legacyId: 3,
    name: "NIKD Sourcing",
    handle: "@nikdsourcing",
    tagline: "India–China End-to-End",
    category: "Apparel",
    location: "India / China",
    moq: 100,
    lowMoq: false,
    lead: "45 days",
    tags: ["Apparel", "Furniture", "Toys", "Multi-category"],
    about:
      "15+ years in international trade. Design to manufacturing, end-to-end. Worked with NCAA, Aeropostale, Rocawear. Trusted factory partners across India and China.",
    offerings: [
      { name: "Apparel Sourcing", moq: "100 units", lead: "45 days" },
      { name: "Product Development", moq: "Custom", lead: "Discuss" },
      { name: "Factory QC & Audit", moq: "N/A", lead: "Project basis" },
    ],
    whatsapp: "919999999993",
    accent: "#5B8FA8",
    yearsInBusiness: 15,
    ordersShipped: 420,
    certifications: ["BSCI", "ISO 9001", "WRAP"],
    rating: 4.7,
    reviewCount: 198,
    reviews: [
      { author: "Maya Iyer", brand: "Halo Apparel", rating: 5, text: "Found us a factory in Tirupur in two weeks. Sample, costing, MOQ — handled." },
      { author: "Aditya P.", brand: "Northstar", rating: 5, text: "Audit reports they share are detailed. Saved me a flight to Shenzhen." },
    ],
    photos: photos("nikd", 5),
    video: { url: SAMPLE_VIDEO, thumbnail: "https://picsum.photos/seed/nikd-video/900/560", duration: "1:24" },
  },
  {
    legacyId: 4,
    name: "Swister Hampers",
    handle: "@swisterhampers",
    tagline: "Custom Corporate Gifting",
    category: "Gifting",
    location: "Noida",
    moq: 20,
    lowMoq: true,
    lead: "7 days",
    tags: ["MDF", "Acrylic", "Sunboard", "Custom"],
    about:
      "Fully customised hampers for corporate and D2C gifting. Fast turnaround, bulk friendly. Low MOQ for brand pilots and limited editions.",
    offerings: [
      { name: "Corporate Gift Hampers", moq: "20 units", lead: "7 days" },
      { name: "Branded Acrylic Boxes", moq: "50 units", lead: "10 days" },
      { name: "Custom MDF Trays", moq: "30 units", lead: "10 days" },
    ],
    whatsapp: "919266233550",
    accent: "#8A6FAB",
    yearsInBusiness: 5,
    ordersShipped: 180,
    certifications: ["MSME", "GST Verified"],
    rating: 4.9,
    reviewCount: 87,
    reviews: [
      { author: "Kavya M.", brand: "Auriga", rating: 5, text: "20-unit pilot for our Diwali drop. Done in 5 days and looked premium on camera." },
      { author: "Sameer Jain", brand: "Cratebox", rating: 5, text: "MDF boxes were spot-on. Will use again for next launch." },
      { author: "Devika R.", brand: "Bloom & Wild IN", rating: 4, text: "Pricing per unit dropped meaningfully at 50+. Worth bundling reorders." },
    ],
    photos: photos("swister", 5),
    video: { url: SAMPLE_VIDEO, thumbnail: "https://picsum.photos/seed/swister-video/900/560", duration: "0:46" },
  },
  {
    legacyId: 5,
    name: "Snaplogo",
    handle: "@snaplogo",
    tagline: "Packaging for SKU Testing",
    category: "Packaging",
    location: "Pan India",
    moq: 50,
    lowMoq: true,
    lead: "10 days",
    tags: ["Sachets", "Stick Packs", "Pouches", "Boxes"],
    about:
      "Built for brands testing new SKUs. Transparent pricing, predictable timelines, full order visibility. Low MOQs so you don't bet your budget on an untested format.",
    offerings: [
      { name: "Sachet Packaging", moq: "50 units", lead: "10 days" },
      { name: "Stick Pack Format", moq: "100 units", lead: "12 days" },
      { name: "Stand-up Pouches", moq: "50 units", lead: "10 days" },
    ],
    whatsapp: "919999999995",
    accent: "#4A9B7A",
    yearsInBusiness: 6,
    ordersShipped: 210,
    certifications: ["FSSAI", "ISO 22000", "BRC Food"],
    rating: 4.5,
    reviewCount: 124,
    reviews: [
      { author: "Rajni Ohri", brand: "Ohria Ayurveda", rating: 5, text: "Pricing was transparent from day one. No surprises at invoice." },
      { author: "Ishita Sharma", brand: "Roots & Brews", rating: 4, text: "Stick packs at MOQ 100 saved us from over-ordering on an untested SKU." },
    ],
    photos: photos("snaplogo", 6),
    video: { url: SAMPLE_VIDEO, thumbnail: "https://picsum.photos/seed/snaplogo-video/900/560", duration: "0:58" },
  },
  {
    legacyId: 6,
    name: "VRG BioPharma",
    handle: "@vrgbiopharma",
    tagline: "Herbal & Nutraceutical Mfg.",
    category: "Nutraceuticals",
    location: "Hyderabad",
    moq: 100,
    lowMoq: false,
    lead: "30 days",
    tags: ["Herbal", "Capsules", "Powders", "Ayurvedic"],
    about:
      "Nutraceutical and herbal product manufacturer. Works with D2C wellness brands on formulation, packaging and white-label production. GMP certified facility.",
    offerings: [
      { name: "White Label Capsules", moq: "100 units", lead: "30 days" },
      { name: "Herbal Powders", moq: "50 kg", lead: "21 days" },
      { name: "Ayurvedic Formulations", moq: "Custom", lead: "Discuss" },
    ],
    whatsapp: "919999999996",
    accent: "#7A9B4A",
    yearsInBusiness: 18,
    ordersShipped: 340,
    certifications: ["GMP", "FDA", "FSSAI", "ISO 9001", "AYUSH"],
    rating: 4.7,
    reviewCount: 265,
    reviews: [
      { author: "Dr. Mehta", brand: "Vital Plus", rating: 5, text: "GMP facility, clean process. Capsules consistent batch to batch." },
      { author: "Tara K.", brand: "Vana Wellness", rating: 5, text: "Helped with the formulation, not just manufactured what we sent." },
      { author: "Shrey P.", brand: "Adya Botanicals", rating: 4, text: "Lead times on custom blends are predictable. Useful for launch planning." },
    ],
    photos: photos("vrg", 5),
    video: { url: SAMPLE_VIDEO, thumbnail: "https://picsum.photos/seed/vrg-video/900/560", duration: "1:12" },
  },
];

async function main() {
  console.log("Seeding suppliers…");
  for (const s of SUPPLIERS) {
    await prisma.supplier.upsert({
      where: { legacyId: s.legacyId },
      update: {},
      create: {
        legacyId: s.legacyId,
        name: s.name,
        handle: s.handle,
        tagline: s.tagline,
        category: s.category,
        location: s.location,
        moq: s.moq,
        lowMoq: s.lowMoq,
        lead: s.lead,
        about: s.about,
        whatsapp: s.whatsapp,
        accent: s.accent,
        yearsInBusiness: s.yearsInBusiness,
        ordersShipped: s.ordersShipped,
        videoUrl: s.video?.url ?? null,
        videoThumbnail: s.video?.thumbnail ?? null,
        videoDuration: s.video?.duration ?? null,
        tags: s.tags,
        certifications: s.certifications,
        photos: s.photos,
        status: "APPROVED",
        offerings: {
          create: s.offerings.map((o, i) => ({ ...o, position: i })),
        },
      },
    });
    console.log(`  ✓ ${s.name}`);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
