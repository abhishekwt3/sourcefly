import "server-only";
import { prisma } from "./db";

function toDTO(s) {
  return {
    id: s.id,
    name: s.name,
    handle: s.handle,
    tagline: s.tagline,
    category: s.category,
    location: s.location,
    city: s.city,
    country: s.country,
    logoUrl: s.logoUrl,
    moq: s.moq,
    lowMoq: s.lowMoq,
    lead: s.lead,
    about: s.about,
    tags: s.tags ?? [],
    offerings: s.offerings.map((o) => ({
      name: o.name,
      pack: o.pack,
      moq: o.moq,
      lead: o.lead,
      price: o.price,
      priceMin: o.priceMin,
      priceMax: o.priceMax,
      priceOnEnquiry: o.priceOnEnquiry,
      tag: o.tag,
      image: o.image,
    })),
    wa: s.whatsapp,
    accent: s.accent,
    yearsInBusiness: s.yearsInBusiness,
    ordersShipped: s.ordersShipped,
    recommendCount: s.recommendCount ?? 0,
    certifications: s.certifications ?? [],
    certPdfs: s.certPdfs ?? [],
    photos: s.photos ?? [],
    facilityPhotos: s.facilityPhotos ?? [],
    video: s.videoUrl
      ? { url: s.videoUrl, thumbnail: s.videoThumbnail, duration: s.videoDuration }
      : null,
  };
}

export async function getApprovedSuppliers() {
  const rows = await prisma.supplier.findMany({
    where: { status: "APPROVED" },
    include: {
      offerings: { orderBy: { position: "asc" } },
    },
    orderBy: { name: "asc" },
  });
  return rows.map(toDTO);
}

export async function getSupplierById(id) {
  const row = await prisma.supplier.findUnique({
    where: { id },
    include: { offerings: { orderBy: { position: "asc" } } },
  });
  return row ? toDTO(row) : null;
}
