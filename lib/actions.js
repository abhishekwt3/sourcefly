"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
}

export async function submitListing(payload) {
  if (!payload?.name?.trim() || !payload?.location?.trim() || !payload?.whatsapp?.trim()) {
    return { ok: false, error: "Name, location and WhatsApp are required." };
  }

  const digits = String(payload.whatsapp).replace(/\D/g, "");
  if (digits.length < 10) {
    return { ok: false, error: "Enter a valid WhatsApp number." };
  }

  const moqNumeric = Number(String(payload.moq).replace(/\D/g, "")) || 0;
  const handle = `@${slugify(payload.name)}-${Math.random().toString(36).slice(2, 6)}`;

  await prisma.supplier.create({
    data: {
      name: payload.name.trim(),
      handle,
      tagline: payload.category ? `${payload.category} supplier` : "Supplier",
      category: payload.category?.trim() || "Uncategorized",
      location: payload.location.trim(),
      moq: moqNumeric,
      lowMoq: moqNumeric > 0 && moqNumeric <= 100,
      lead: "TBD",
      about: payload.description?.trim() || "",
      whatsapp: digits,
      accent: "#D4A853",
      status: "PENDING",
      submittedBy: payload.email?.trim() || null,
    },
  });

  revalidatePath("/");
  return { ok: true };
}

export async function submitRequirement(payload) {
  if (!payload?.name?.trim() || !payload?.description?.trim()) {
    return { ok: false, error: "Name and requirement description are required." };
  }
  await prisma.buyerRequirement.create({
    data: {
      name: payload.name.trim(),
      brand: payload.brand?.trim() || null,
      category: payload.category?.trim() || null,
      description: payload.description.trim(),
      moq: payload.moq?.trim() || null,
      timeline: payload.timeline?.trim() || null,
      email: payload.email?.trim() || null,
    },
  });
  return { ok: true };
}
