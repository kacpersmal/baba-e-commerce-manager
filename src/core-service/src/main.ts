import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production'
          ? {
              directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
              },
            }
          : false, // Disable CSP in dev to allow Swagger UI
      crossOriginEmbedderPolicy: false, // Allow embedding (needed for some integrations)
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS only in development
  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
    });

    // Setup OpenAPI documentation (dev only)
    const config = new DocumentBuilder()
      .setTitle('Core Service API')
      .setDescription('NestJS Core Service with PostgreSQL and Redis')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer('http://localhost:8000', 'Development')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Setup Swagger UI at /docs
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'Core Service API Docs',
    });

    logger.log('Swagger documentation available at http://localhost:8000/docs');
  }

  const port = process.env.PORT ?? 8000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
