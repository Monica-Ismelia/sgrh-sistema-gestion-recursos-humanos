import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 🧩 Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Gestión de Recursos Humanos (SGRH)')
    .setDescription('API del sistema para la gestión de empleados, cargos y departamentos.')
    .setVersion('1.0')
    .addTag('Empleados')
    .addTag('Departamento')
    .addTag('Cargos')
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
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Servidor ejecutándose en: http://localhost:${port}`);

  // 👑 SEEDER ADMIN
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const adminExists = await userRepository.findOne({
      where: { role: 'admin' },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const admin = userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });

      await userRepository.save(admin);
      console.log('👑 Admin creado automáticamente');
    } else {
      console.log('✅ Admin ya existe');
    }
  }
}

bootstrap();