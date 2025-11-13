import { PrismaClient } from '@prisma/client';

export async function seedWarehouses(prisma: PrismaClient) {
  const warehouses = [
    {
      name: 'Magazyn Centralny Dąbrowa Górnicza',
      code: 'WH-DG-01',
      description: 'Główny magazyn dystrybucyjny dla regionu śląskiego',
      latitude: 50.3249,
      longitude: 19.1982,
      address: 'ul. Przemysłowa 15',
      city: 'Dąbrowa Górnicza',
      state: 'Śląskie',
      country: 'Polska',
      postalCode: '41-300',
      contactName: 'Jan Kowalski',
      contactEmail: 'dabrowa@example.pl',
      contactPhone: '+48 32 123 4567',
    },
    {
      name: 'Magazyn Warszawa',
      code: 'WH-WAW-01',
      description: 'Centrum dystrybucyjne dla Mazowsza',
      latitude: 52.2297,
      longitude: 21.0122,
      address: 'ul. Magazynowa 42',
      city: 'Warszawa',
      state: 'Mazowieckie',
      country: 'Polska',
      postalCode: '00-001',
      contactName: 'Anna Nowak',
      contactEmail: 'warszawa@example.pl',
      contactPhone: '+48 22 987 6543',
    },
    {
      name: 'Magazyn Gdańsk Port',
      code: 'WH-GDN-01',
      description: 'Magazyn portowy dla regionu północnego',
      latitude: 54.352,
      longitude: 18.6466,
      address: 'ul. Portowa 8',
      city: 'Gdańsk',
      state: 'Pomorskie',
      country: 'Polska',
      postalCode: '80-001',
      contactName: 'Piotr Wiśniewski',
      contactEmail: 'gdansk@example.pl',
      contactPhone: '+48 58 345 6789',
    },
  ];

  for (const warehouse of warehouses) {
    await prisma.warehouse.upsert({
      where: { code: warehouse.code },
      update: {},
      create: warehouse,
    });
  }

  console.log('✅ Warehouses seeded');
}
