/**
 * Cleanup script for removing dummy/seed data.
 *
 * Usage:
 *   node prisma/clear-seed.mjs            # remove only the 6 seeded fixtures
 *   node prisma/clear-seed.mjs --all      # wipe ALL suppliers, recommendations,
 *                                         # buyer requirements (KEEPS users)
 *   node prisma/clear-seed.mjs --nuke     # wipe everything including users
 *
 * Cascades: Supplier delete -> Offering + Recommendation
 *           User delete    -> Supplier (via ownerId) + Recommendation
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const flag = process.argv[2];

  if (flag === "--nuke") {
    console.log("Wiping ALL data (users, suppliers, recommendations, requirements)…");
    await prisma.$transaction([
      prisma.recommendation.deleteMany({}),
      prisma.offering.deleteMany({}),
      prisma.supplier.deleteMany({}),
      prisma.buyerRequirement.deleteMany({}),
      prisma.user.deleteMany({}),
    ]);
    console.log("✓ All data removed.");
    return;
  }

  if (flag === "--all") {
    console.log("Removing all suppliers, recommendations, buyer requirements (keeping users)…");
    await prisma.$transaction([
      prisma.recommendation.deleteMany({}),
      prisma.offering.deleteMany({}),
      prisma.supplier.deleteMany({}),
      prisma.buyerRequirement.deleteMany({}),
    ]);
    console.log("✓ Suppliers/recommendations/requirements removed. Users preserved.");
    return;
  }

  // Default: remove only seeded fixtures (have legacyId set)
  const seeded = await prisma.supplier.findMany({
    where: { legacyId: { not: null } },
    select: { id: true, name: true, legacyId: true },
  });
  if (seeded.length === 0) {
    console.log("No seeded suppliers found (nothing with legacyId).");
    return;
  }
  console.log(`Removing ${seeded.length} seeded suppliers:`);
  seeded.forEach((s) => console.log(`  #${s.legacyId}  ${s.name}`));
  await prisma.supplier.deleteMany({ where: { legacyId: { not: null } } });
  console.log("✓ Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
