"use server";

import { prisma } from "./db";
import { getCurrentUser } from "./auth";
import { revalidatePath } from "next/cache";

function slugify(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
}

async function getOrCreateOwnedSupplier(userId) {
  const existing = await prisma.supplier.findUnique({ where: { ownerId: userId } });
  if (existing) return existing;
  return await prisma.supplier.create({
    data: {
      ownerId: userId,
      name: "",
      handle: `@draft-${userId.slice(0, 6)}-${Math.random().toString(36).slice(2, 6)}`,
      tagline: "",
      category: "",
      location: "",
      moq: 0,
      lead: "",
      about: "",
      whatsapp: "",
      status: "APPROVED",
    },
  });
}

export async function saveSellerStep1(data) {
  const me = await getCurrentUser();
  if (!me || me.role !== "SELLER") return { ok: false, error: "Not authorized" };

  if (!data.name?.trim() || !data.tagline?.trim() || !data.category?.trim() || !data.location?.trim()) {
    return { ok: false, error: "Fill all required fields" };
  }

  const supplier = await getOrCreateOwnedSupplier(me.id);

  // Handle: prefer user-supplied, otherwise auto from name. Enforce uniqueness.
  const desiredHandle = data.handle?.trim() || `@${slugify(data.name)}`;
  const handle = desiredHandle.startsWith("@") ? desiredHandle : `@${desiredHandle}`;
  const conflict = await prisma.supplier.findFirst({
    where: { handle, NOT: { id: supplier.id } },
  });
  const finalHandle = conflict ? `${handle}-${Math.random().toString(36).slice(2, 5)}` : handle;

  await prisma.supplier.update({
    where: { id: supplier.id },
    data: {
      name: data.name.trim(),
      handle: finalHandle,
      tagline: data.tagline.trim().slice(0, 80),
      category: data.category.trim(),
      location: data.location.trim(),
    },
  });

  return { ok: true, handle: finalHandle };
}

export async function saveSellerStep2(data) {
  const me = await getCurrentUser();
  if (!me || me.role !== "SELLER") return { ok: false, error: "Not authorized" };
  if (!data.about?.trim()) return { ok: false, error: "About is required" };

  const supplier = await getOrCreateOwnedSupplier(me.id);
  await prisma.supplier.update({
    where: { id: supplier.id },
    data: {
      about: data.about.trim().slice(0, 500),
      yearsInBusiness: data.yearsInBusiness ? Number(data.yearsInBusiness) : null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      certifications: Array.isArray(data.certifications) ? data.certifications : [],
    },
  });
  return { ok: true };
}

export async function saveSellerStep3(data) {
  const me = await getCurrentUser();
  if (!me || me.role !== "SELLER") return { ok: false, error: "Not authorized" };
  const moq = Number(String(data.moq || "").replace(/\D/g, "")) || 0;
  if (moq <= 0) return { ok: false, error: "MOQ is required" };
  if (!data.lead?.trim()) return { ok: false, error: "Lead time is required" };

  const supplier = await getOrCreateOwnedSupplier(me.id);
  await prisma.supplier.update({
    where: { id: supplier.id },
    data: {
      moq,
      lowMoq: typeof data.lowMoq === "boolean" ? data.lowMoq : moq <= 100,
      lead: data.lead.trim(),
    },
  });
  return { ok: true };
}

export async function saveSellerStep4(data) {
  const me = await getCurrentUser();
  if (!me || me.role !== "SELLER") return { ok: false, error: "Not authorized" };
  const offerings = Array.isArray(data.offerings)
    ? data.offerings.filter((o) => o.name?.trim() && o.moq?.trim() && o.lead?.trim())
    : [];
  if (offerings.length === 0) return { ok: false, error: "Add at least one offering" };

  const supplier = await getOrCreateOwnedSupplier(me.id);
  await prisma.$transaction([
    prisma.offering.deleteMany({ where: { supplierId: supplier.id } }),
    prisma.offering.createMany({
      data: offerings.map((o, i) => ({
        supplierId: supplier.id,
        name: o.name.trim(),
        moq: o.moq.trim(),
        lead: o.lead.trim(),
        position: i,
      })),
    }),
  ]);
  return { ok: true };
}

export async function saveSellerStep5(data) {
  const me = await getCurrentUser();
  if (!me || me.role !== "SELLER") return { ok: false, error: "Not authorized" };
  const digits = String(data.whatsapp || "").replace(/\D/g, "");
  if (digits.length < 10) return { ok: false, error: "Valid WhatsApp number required" };

  const supplier = await getOrCreateOwnedSupplier(me.id);
  await prisma.supplier.update({
    where: { id: supplier.id },
    data: {
      whatsapp: digits,
      accent: data.accent?.trim() || supplier.accent || "#D4A853",
      photos: Array.isArray(data.photos) ? data.photos : [],
      videoUrl: data.videoUrl?.trim() || null,
      videoThumbnail: data.videoThumbnail?.trim() || null,
      videoDuration: data.videoDuration?.trim() || null,
    },
  });
  return { ok: true };
}

export async function submitSellerForReview() {
  const me = await getCurrentUser();
  if (!me || me.role !== "SELLER") return { ok: false, error: "Not authorized" };
  const supplier = await prisma.supplier.findUnique({ where: { ownerId: me.id } });
  if (!supplier) return { ok: false, error: "No listing draft found" };

  const missing = [];
  if (!supplier.name) missing.push("business name");
  if (!supplier.tagline) missing.push("tagline");
  if (!supplier.category) missing.push("category");
  if (!supplier.location) missing.push("location");
  if (!supplier.about) missing.push("about");
  if (!supplier.moq) missing.push("MOQ");
  if (!supplier.lead) missing.push("lead time");
  if (!supplier.whatsapp) missing.push("WhatsApp");
  if (missing.length) return { ok: false, error: `Missing: ${missing.join(", ")}` };

  await prisma.supplier.update({
    where: { id: supplier.id },
    data: { status: "APPROVED", submittedBy: me.phone },
  });
  revalidatePath("/");
  return { ok: true };
}

export async function updateListing(data) {
  const me = await getCurrentUser();
  if (!me || me.role !== "SELLER") return { ok: false, error: "Not authorized" };

  const supplier = await prisma.supplier.findUnique({ where: { ownerId: me.id } });
  if (!supplier) return { ok: false, error: "No listing found" };

  const missing = [];
  if (!data.name?.trim()) missing.push("business name");
  if (!data.tagline?.trim()) missing.push("tagline");
  if (!data.category?.trim()) missing.push("category");
  const hasLocation =
    data.location?.trim() || data.city?.trim() || data.country?.trim();
  if (!hasLocation) missing.push("city");
  if (!data.about?.trim()) missing.push("about");
  const moq = Number(String(data.moq || "").replace(/\D/g, "")) || 0;
  if (moq <= 0) missing.push("MOQ");
  if (!data.lead?.trim()) missing.push("lead time");
  const digits = String(data.whatsapp || "").replace(/\D/g, "");
  if (digits.length < 10) missing.push("WhatsApp");
  const offerings = Array.isArray(data.offerings)
    ? data.offerings.filter((o) => o.name?.trim() && o.moq?.trim())
    : [];
  if (offerings.length === 0) missing.push("at least one offering");
  if (missing.length) return { ok: false, error: `Missing: ${missing.join(", ")}` };

  const city = data.city?.trim() || null;
  const country = data.country?.trim() || "India";
  const location = data.location?.trim() || [city, country].filter(Boolean).join(", ");

  // Handle: user-supplied if changed, otherwise keep existing.
  // Enforce uniqueness — append random suffix on conflict.
  let finalHandle = supplier.handle;
  const desired = (data.handle || "").trim();
  if (desired) {
    const normalized = desired.startsWith("@") ? desired : `@${desired}`;
    if (normalized !== supplier.handle) {
      const conflict = await prisma.supplier.findFirst({
        where: { handle: normalized, NOT: { id: supplier.id } },
        select: { id: true },
      });
      finalHandle = conflict
        ? `${normalized}-${Math.random().toString(36).slice(2, 5)}`
        : normalized;
    }
  }

  await prisma.$transaction([
    prisma.supplier.update({
      where: { id: supplier.id },
      data: {
        name: data.name.trim(),
        handle: finalHandle,
        tagline: data.tagline.trim().slice(0, 80),
        category: data.category.trim(),
        location,
        city,
        country,
        logoUrl: data.logoUrl?.trim() || null,
        about: data.about.trim().slice(0, 500),
        yearsInBusiness: data.yearsInBusiness ? Number(data.yearsInBusiness) : null,
        tags: Array.isArray(data.tags) ? data.tags : [],
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
        certPdfs: Array.isArray(data.certPdfs) ? data.certPdfs : [],
        moq,
        lowMoq: typeof data.lowMoq === "boolean" ? data.lowMoq : moq <= 100,
        lead: data.lead.trim(),
        whatsapp: digits,
        accent: data.accent?.trim() || supplier.accent || "#D4A853",
        photos: Array.isArray(data.photos) ? data.photos.slice(0, 6) : [],
        facilityPhotos: Array.isArray(data.facilityPhotos)
          ? data.facilityPhotos.slice(0, 4)
          : [],
        videoUrl: data.videoUrl?.trim() || null,
        videoThumbnail: data.videoThumbnail?.trim() || null,
        videoDuration: data.videoDuration?.trim() || null,
      },
    }),
    prisma.offering.deleteMany({ where: { supplierId: supplier.id } }),
    prisma.offering.createMany({
      data: offerings.map((o, i) => {
        const priceOnEnquiry = Boolean(o.priceOnEnquiry);
        const priceMin = priceOnEnquiry
          ? null
          : Number(String(o.priceMin || "").replace(/\D/g, "")) || null;
        const priceMax = priceOnEnquiry
          ? null
          : Number(String(o.priceMax || "").replace(/\D/g, "")) || null;
        const computedPrice = priceOnEnquiry
          ? "On enquiry"
          : priceMin && priceMax
          ? `₹${priceMin}–₹${priceMax}/unit`
          : priceMin
          ? `₹${priceMin}/unit`
          : null;
        return {
          supplierId: supplier.id,
          name: o.name.trim(),
          pack: o.pack?.trim() || null,
          moq: o.moq.trim(),
          lead: o.lead?.trim() || "",
          price: o.price?.trim() || computedPrice,
          priceMin,
          priceMax,
          priceOnEnquiry,
          tag: o.tag?.trim() || null,
          image: o.image?.trim() || null,
          position: i,
        };
      }),
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/seller/manage");
  return { ok: true };
}
