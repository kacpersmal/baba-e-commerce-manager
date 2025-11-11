import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCategories(client: PrismaClient = prisma) {
  console.log('🌱 Seeding categories...');

  // Define parent categories with their data
  const categories = [
    {
      name: 'Elektronika',
      slug: 'electronics',
      icon: 'Smartphone',
      color: 'text-blue-500',
      order: 0,
      children: [
        { name: 'Laptopy', slug: 'laptops', order: 0 },
        { name: 'Tablety', slug: 'tablets', order: 1 },
        { name: 'Audio', slug: 'audio', order: 2 },
        { name: 'Gaming', slug: 'gaming', order: 3 },
        { name: 'Akcesoria', slug: 'accessories', order: 4 },
        { name: 'Smart Home', slug: 'smart-home', order: 5 },
        { name: 'Kamery i aparaty', slug: 'cameras', order: 6 },
        { name: 'Telewizory', slug: 'tvs', order: 7 },
        { name: 'Projektory', slug: 'projectors', order: 8 },
        { name: 'Drukarki', slug: 'printers', order: 9 },
        { name: 'Monitory', slug: 'monitors', order: 10 },
        { name: 'Routery i sieci', slug: 'routers', order: 11 },
        { name: 'Drony', slug: 'drones', order: 12 },
        { name: 'Wearables', slug: 'wearables', order: 13 },
        {
          name: 'Akcesoria komputerowe',
          slug: 'computer-accessories',
          order: 14,
        },
        { name: 'Oprogramowanie', slug: 'software', order: 15 },
        { name: 'Nośniki danych', slug: 'storage', order: 16 },
        { name: 'Kable i ładowarki', slug: 'cables-chargers', order: 17 },
        { name: 'Elektronika samochodowa', slug: 'car-electronics', order: 18 },
        { name: 'Audio samochodowe', slug: 'car-audio', order: 19 },
        { name: 'Głośniki Bluetooth', slug: 'bluetooth-speakers', order: 20 },
        { name: 'Słuchawki', slug: 'headphones', order: 21 },
        { name: 'Konsolki i akcesoria', slug: 'consoles', order: 22 },
        { name: 'VR i AR', slug: 'vr-ar', order: 23 },
      ],
    },
    {
      name: 'Moda',
      slug: 'fashion',
      icon: 'Shirt',
      color: 'text-pink-500',
      order: 1,
      children: [
        { name: 'Odzież męska', slug: 'men', order: 0 },
        { name: 'Odzież damska', slug: 'women', order: 1 },
        { name: 'Buty', slug: 'shoes', order: 2 },
        { name: 'Biżuteria', slug: 'jewelry', order: 3 },
        { name: 'Torby i dodatki', slug: 'accessories', order: 4 },
        { name: 'Bielizna', slug: 'underwear', order: 5 },
      ],
    },
    {
      name: 'Dom i Ogród',
      slug: 'home',
      icon: 'Home',
      color: 'text-green-600',
      order: 2,
      children: [
        { name: 'Meble', slug: 'furniture', order: 0 },
        { name: 'Dekoracje', slug: 'decor', order: 1 },
        { name: 'Oświetlenie', slug: 'light', order: 2 },
        { name: 'Narzędzia', slug: 'tools', order: 3 },
        { name: 'Rośliny', slug: 'plants', order: 4 },
        { name: 'Kuchnia', slug: 'kitchen', order: 5 },
      ],
    },
    {
      name: 'Uroda',
      slug: 'beauty',
      icon: 'Sparkles',
      color: 'text-purple-500',
      order: 3,
      children: [
        { name: 'Makijaż', slug: 'makeup', order: 0 },
        { name: 'Pielęgnacja', slug: 'skincare', order: 1 },
        { name: 'Perfumy', slug: 'perfumes', order: 2 },
        { name: 'Włosy', slug: 'haircare', order: 3 },
        { name: 'Manicure', slug: 'nails', order: 4 },
        { name: 'Higiena osobista', slug: 'personal-hygiene', order: 5 },
      ],
    },
    {
      name: 'Sport',
      slug: 'sport',
      icon: 'Dumbbell',
      color: 'text-orange-500',
      order: 4,
      children: [
        { name: 'Fitness', slug: 'fitness', order: 0 },
        { name: 'Piłka nożna', slug: 'football', order: 1 },
        { name: 'Kolarstwo', slug: 'cycling', order: 2 },
        { name: 'Siłownia', slug: 'gym', order: 3 },
        { name: 'Bieganie', slug: 'running', order: 4 },
        { name: 'Sporty zimowe', slug: 'winter', order: 5 },
      ],
    },
    {
      name: 'Motoryzacja',
      slug: 'auto',
      icon: 'Car',
      color: 'text-gray-700',
      order: 5,
      children: [
        { name: 'Części', slug: 'parts', order: 0 },
        { name: 'Oleje', slug: 'oils', order: 1 },
        { name: 'Akcesoria', slug: 'accessories', order: 2 },
        { name: 'Opony', slug: 'tires', order: 3 },
        { name: 'Motocykle', slug: 'motorcycles', order: 4 },
        { name: 'Samochody elektryczne', slug: 'electric-cars', order: 5 },
      ],
    },
    {
      name: 'Książki',
      slug: 'books',
      icon: 'BookOpen',
      color: 'text-indigo-500',
      order: 6,
      children: [
        { name: 'Literatura piękna', slug: 'fiction', order: 0 },
        { name: 'Nauka i edukacja', slug: 'education', order: 1 },
        { name: 'Komiksy', slug: 'comics', order: 2 },
        { name: 'Poradniki', slug: 'guides', order: 3 },
      ],
    },
    {
      name: 'Muzyka',
      slug: 'music',
      icon: 'Music',
      color: 'text-red-500',
      order: 7,
      children: [
        { name: 'CD', slug: 'cd', order: 0 },
        { name: 'Winyle', slug: 'vinyl', order: 1 },
        { name: 'Instrumenty', slug: 'instruments', order: 2 },
        { name: 'Akcesoria muzyczne', slug: 'accessories', order: 3 },
      ],
    },
    {
      name: 'Zwierzęta',
      slug: 'pets',
      icon: 'Panda',
      color: 'text-yellow-500',
      order: 8,
      children: [
        { name: 'Psy', slug: 'dogs', order: 0 },
        { name: 'Koty', slug: 'cats', order: 1 },
        { name: 'Akcesoria', slug: 'accessories', order: 2 },
        { name: 'Karma', slug: 'food', order: 3 },
      ],
    },
    {
      name: 'Fotografia',
      slug: 'photography',
      icon: 'Camera',
      color: 'text-teal-500',
      order: 9,
      children: [
        { name: 'Aparaty', slug: 'cameras', order: 0 },
        { name: 'Obiektywy', slug: 'lenses', order: 1 },
        { name: 'Statywy', slug: 'tripods', order: 2 },
        { name: 'Akcesoria', slug: 'accessories', order: 3 },
      ],
    },
  ];

  // Create parent categories and their children
  for (const parentData of categories) {
    const { children, ...parentCategory } = parentData;

    // Create parent category
    const parent = await client.category.upsert({
      where: { slug: parentCategory.slug },
      update: parentCategory,
      create: parentCategory,
    });

    console.log(`✓ Created parent category: ${parent.name}`);

    // Create children
    if (children && children.length > 0) {
      for (const childData of children) {
        const childSlug = `${parentCategory.slug}-${childData.slug}`;
        await client.category.upsert({
          where: { slug: childSlug },
          update: {
            ...childData,
            slug: childSlug,
            parentId: parent.id,
          },
          create: {
            ...childData,
            slug: childSlug,
            parentId: parent.id,
          },
        });
      }
      console.log(`  ✓ Created ${children.length} subcategories`);
    }
  }

  console.log('✅ Categories seeded successfully!');
}

// Allow running this seed file directly
async function main() {
  try {
    await seedCategories();
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Only run main if this file is executed directly
if (require.main === module) {
  main();
}
