# Core Service

NestJS-based core service with PostgreSQL (Prisma) and Redis integration.

## Getting Started

```bash
npm install
npm run start:dev
```

Visit <http://localhost:8000/docs> for interactive API documentation (development only).

## Environment Variables

Configure `.env` file with your database and Redis credentials.

## Database (Prisma)

**Docs:** <https://www.prisma.io/docs>

### Common Commands

```bash
# Generate client after schema changes
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name migration_name

# Open database GUI
npx prisma studio
```

### Database Seeding

Populate the database with initial data using seed scripts:

```bash
# Run all seed scripts
npm run seed

# Run specific seed script
npm run seed:categories
```

**Creating New Seeds:**

1. Create a new seed file in `prisma/seeds/` (e.g., `products.seed.ts`)
2. Export a seed function that accepts a PrismaClient
3. Add the function to `prisma/seeds/index.ts`
4. Add a script in `package.json` for individual execution (optional)

Example seed file structure:

```typescript
import { PrismaClient } from '@prisma/client';

export async function seedProducts(client: PrismaClient) {
  console.log('🌱 Seeding products...');
  // Your seeding logic here
  console.log('✅ Products seeded successfully!');
}

// Allow direct execution
if (require.main === module) {
  const prisma = new PrismaClient();
  seedProducts(prisma)
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
```

### Prisma Usage in Code

```typescript
import { PrismaService } from '@shared/prisma';

constructor(private readonly prisma: PrismaService) {}

// Query examples
await this.prisma.user.findMany();
await this.prisma.user.create({ data });
```

## Redis

**Docs:** <https://github.com/redis/ioredis>

### Usage

```typescript
import { RedisService } from '@shared/redis';

constructor(private readonly redis: RedisService) {}

// Basic operations
await this.redis.set('key', 'value');
await this.redis.get('key');
await this.redis.setex('key', 3600, 'value'); // with TTL
```

## Configuration

```typescript
import { AppConfigService } from '@shared/config';

constructor(private readonly config: AppConfigService) {}

const { port, isDevelopment } = this.config.app;
const dbConfig = this.config.database;
const redisConfig = this.config.redis;
```

## API Documentation

Interactive Swagger API documentation is available at <http://localhost:8000/docs> (development only).

**Features:**

- Interactive API testing
- Request/response schemas
- Try out endpoints directly
- Organized by tags (health, cache, database)
- Persistent authorization

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
// Instead of: import { PrismaService } from '../../shared/prisma';
import { PrismaService } from '@shared/prisma';

// Available aliases:
// @/*          -> src/*
// @shared/*    -> src/shared/*
// @config/*    -> src/shared/config/*
// @prisma/*    -> src/shared/prisma/*
// @redis/*     -> src/shared/redis/*
```
