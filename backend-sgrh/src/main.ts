import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  // ✅ Habilita validaciones automáticas
    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades que no estén en el DTO
      forbidNonWhitelisted: true,
      transform: true, // convierte automáticamente tipos primitivos
    }),
  );

  // 🧩 Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Gestión de Recursos Humanos (SGRH)')
    .setDescription('API del sistema para la gestión de empleados, cargos y departamentos.')
    .setVersion('1.0')
    .addTag('Empleados')
     .addTag('Departamento')
    .addTag('Cargos')
    // ✅ AGREGAR ESTO: Configuración para botón Authorize (JWT Bearer)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
     .build();

     

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 👉 http://localhost:3000/api

  // Habilitar CORS (opcional, útil si hay frontend separado)
  app.enableCors();

  const port = process.env.PORT || 3000;
await app.listen(port);
  console.log(`🚀 Servidor ejecutándose en: http://localhost:${port}`);
}
bootstrap();
