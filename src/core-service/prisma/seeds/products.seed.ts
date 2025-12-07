import { PrismaClient } from '@prisma/client';

export async function seedProducts(prisma: PrismaClient) {
  console.log('🌱 Seeding products...');

  // Get any three existing categories to use
  const categories = await prisma.category.findMany({
    take: 3,
    where: {
      parentId: { not: null }, // Get child categories
    },
  });

  if (categories.length < 3) {
    console.log(
      '⚠️  Not enough categories found. Please run categories seed first.',
    );
    return;
  }

  const [category1, category2, category3] = categories;

  // Get warehouses
  const warehouses = await prisma.warehouse.findMany();
  if (warehouses.length === 0) {
    console.log('⚠️  Warehouses not found. Please run warehouses seed first.');
    return;
  }

  const products = [
    {
      name: 'Wireless Noise-Cancelling Headphones Pro X',
      slug: 'wireless-headphones-pro-x',
      description:
        'Advanced wireless headphones with active noise cancellation, 30-hour battery life, premium sound quality, comfortable over-ear design, and built-in microphone for calls. Features Bluetooth 5.0, foldable design, and carrying case included.',
      price: 299.99,
      sku: 'WHP-001',
      imageUrl: './Placeholder_view_vector.svg.png',
      categoryId: category1.id,
      isActive: true,
    },
    {
      name: 'Premium Leather Backpack - Professional',
      slug: 'leather-backpack-professional',
      description:
        'Handcrafted full-grain leather backpack with laptop compartment up to 15.6", multiple organizational pockets, padded shoulder straps, and water-resistant coating. Perfect for professionals and travelers.',
      price: 189.99,
      sku: 'BAG-002',
      imageUrl: './Placeholder_view_vector.svg.png',
      categoryId: category2.id,
      isActive: true,
    },
    {
      name: 'Smart Watch Series 7 - Fitness Tracker',
      slug: 'smart-watch-series-7',
      description:
        'Advanced smartwatch with heart rate monitor, GPS tracking, sleep analysis, waterproof design, 7-day battery life, and smartphone notifications. Includes multiple sport modes and health metrics.',
      price: 399.99,
      sku: 'SW-003',
      imageUrl: './Placeholder_view_vector.svg.png',
      categoryId: category3.id,
      isActive: true,
    },
    {
      name: 'Organic Cotton Bed Sheet Set - Queen',
      slug: 'organic-cotton-sheets-queen',
      description:
        '100% organic cotton bed sheet set including fitted sheet, flat sheet, and 2 pillowcases. 400 thread count, breathable, hypoallergenic, and OEKO-TEX certified. Available in multiple colors.',
      price: 129.99,
      sku: 'HOME-004',
      imageUrl: './Placeholder_view_vector.svg.png',
      categoryId: category1.id,
      isActive: true,
    },
    {
      name: 'Portable Bluetooth Speaker - Waterproof',
      slug: 'bluetooth-speaker-waterproof',
      description:
        'Compact portable speaker with 360° sound, IPX7 waterproof rating, 12-hour battery life, and built-in microphone. Perfect for outdoor adventures, beach trips, and pool parties.',
      price: 79.99,
      sku: 'SPK-005',
      imageUrl: './Placeholder_view_vector.svg.png',
      categoryId: category2.id,
      isActive: true,
    },
    {
      name: 'Classic Aviator Sunglasses - UV Protection',
      slug: 'aviator-sunglasses-uv',
      description:
        'Timeless aviator sunglasses with polarized lenses, 100% UV protection, durable metal frame, and adjustable nose pads. Includes protective case and cleaning cloth.',
      price: 149.99,
      sku: 'SUN-006',
      imageUrl: './Placeholder_view_vector.svg.png',
      categoryId: category3.id,
      isActive: true,
    },
    {
      name: 'Stainless Steel Water Bottle - 32oz',
      slug: 'water-bottle-32oz',
      description:
        'Double-walled vacuum insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof lid, wide mouth for easy cleaning, and fits most cup holders.',
      price: 34.99,
      sku: 'BTL-007',
      imageUrl: './Placeholder_view_vector.svg.png',
      categoryId: category1.id,
      isActive: true,
    },
    {
      name: 'Wireless Charging Pad - Fast Charge',
      slug: 'wireless-charger-fast',
      description:
        'Qi-certified wireless charging pad with fast charging support up to 15W, LED indicator, non-slip surface, and overheating protection. Compatible with all Qi-enabled devices.',
      price: 39.99,
      sku: 'CHG-008',
      imageUrl: './Placeholder_view_vector.svg.png',
      categoryId: category2.id,
      isActive: true,
    },
    {
      name: 'Yoga Mat - Extra Thick Non-Slip',
      slug: 'yoga-mat-extra-thick',
      description:
        'Premium 6mm thick yoga mat with excellent cushioning and grip. Made from eco-friendly TPE material, non-toxic, lightweight, and includes carrying strap. Perfect for yoga, pilates, and fitness.',
      price: 49.99,
      sku: 'YOG-009',
      imageUrl: './Placeholder_view_vector.svg.png',
      categoryId: category3.id,
      isActive: true,
    },
    {
      name: 'Mechanical Gaming Keyboard - RGB',
      slug: 'gaming-keyboard-rgb',
      description:
        'Professional mechanical gaming keyboard with customizable RGB backlighting, tactile switches, anti-ghosting technology, programmable keys, and detachable cable. Built for gamers and professionals.',
      price: 159.99,
      sku: 'KEY-010',
      imageUrl: './Placeholder_view_vector.svg.png',
      categoryId: category1.id,
      isActive: true,
    },
  ];

  for (const productData of products) {
    const existing = await prisma.product.findUnique({
      where: { slug: productData.slug },
    });

    if (!existing) {
      const product = await prisma.product.create({
        data: productData,
      });

      // Add stock to each warehouse
      for (const warehouse of warehouses) {
        const quantity = Math.floor(Math.random() * 100) + 50; // 50-150 units per warehouse

        await prisma.stock.create({
          data: {
            productId: product.id,
            warehouseId: warehouse.id,
            quantity,
            reserved: 0,
          },
        });
      }

      console.log(`✅ Created product: ${product.name}`);
    } else {
      console.log(`⏭️  Product already exists: ${productData.name}`);
    }
  }

  console.log('✅ Products seeded successfully');
}
