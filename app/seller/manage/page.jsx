import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ManageListing from "@/components/seller/ManageListing";

export const dynamic = "force-dynamic";

export default async function SellerManagePage() {
  const me = await getCurrentUser();
  if (!me) redirect("/auth/phone?next=/seller/manage");
  if (me.role !== "SELLER") redirect("/");

  let supplier = await prisma.supplier.findUnique({
    where: { ownerId: me.id },
    include: { offerings: { orderBy: { position: "asc" } } },
  });

  if (!supplier) {
    // First-time seller: create a blank, immediately-live listing so they
    // land straight on the manage form instead of a multi-step wizard.
    supplier = await prisma.supplier.create({
      data: {
        ownerId: me.id,
        name: "",
        handle: `@draft-${me.id.slice(0, 6)}-${Math.random().toString(36).slice(2, 6)}`,
        tagline: "",
        category: "",
        location: "",
        country: "India",
        moq: 0,
        lead: "",
        about: "",
        whatsapp: "",
        status: "APPROVED",
      },
      include: { offerings: { orderBy: { position: "asc" } } },
    });
  }

  return (
    <ManageListing
      supplier={{
        id: supplier.id,
        name: supplier.name,
        handle: supplier.handle,
        tagline: supplier.tagline,
        category: supplier.category,
        location: supplier.location,
        city: supplier.city,
        country: supplier.country,
        logoUrl: supplier.logoUrl,
        moq: supplier.moq,
        lowMoq: supplier.lowMoq,
        lead: supplier.lead,
        about: supplier.about,
        whatsapp: supplier.whatsapp,
        accent: supplier.accent,
        yearsInBusiness: supplier.yearsInBusiness,
        tags: supplier.tags,
        certifications: supplier.certifications,
        certPdfs: supplier.certPdfs,
        photos: supplier.photos,
        facilityPhotos: supplier.facilityPhotos,
        videoUrl: supplier.videoUrl,
        videoThumbnail: supplier.videoThumbnail,
        videoDuration: supplier.videoDuration,
        status: supplier.status,
        offerings: supplier.offerings.map((o) => ({
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
      }}
    />
  );
}
