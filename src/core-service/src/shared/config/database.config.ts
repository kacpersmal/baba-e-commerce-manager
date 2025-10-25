import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USERNAME || 'local_dev',
  password: process.env.POSTGRES_PASSWORD || 'local_dev',
  database: process.env.POSTGRES_DATABASE || 'baba_dev',
}));
