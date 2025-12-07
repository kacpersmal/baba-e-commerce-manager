import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Main seed file - orchestrates all seed scripts
 * Add new seed functions here as they are created
 */
async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Import and run seed functions
    const { seedCategories } = await import('./categories.seed.js');
    const { seedWarehouses } = await import('./warehouses.seed.js');
    const { seedProducts } = await import('./products.seed.js');

    await seedCategories(prisma);
    await seedWarehouses(prisma);
    await seedProducts(prisma);

    // Add more seed functions here as needed:
    // await seedUsers(prisma);
    // etc.

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error during database seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
