# Core Service

NestJS-based core service with PostgreSQL (Prisma) and Redis integration.

## Getting Started

```bash
npm install
npm run start:dev
```

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

### Usage

```typescript
import { PrismaService } from './shared/prisma';

constructor(private readonly prisma: PrismaService) {}

// Query examples
await this.prisma.user.findMany();
await this.prisma.user.create({ data });
```

## Redis

**Docs:** <https://github.com/redis/ioredis>

### Usage

```typescript
import { RedisService } from './shared/redis';

constructor(private readonly redis: RedisService) {}

// Basic operations
await this.redis.set('key', 'value');
await this.redis.get('key');
await this.redis.setex('key', 3600, 'value'); // with TTL
```

## Configuration

```typescript
import { AppConfigService } from './shared/config';

constructor(private readonly config: AppConfigService) {}

const { port, isDevelopment } = this.config.app;
const dbConfig = this.config.database;
const redisConfig = this.config.redis;
```
