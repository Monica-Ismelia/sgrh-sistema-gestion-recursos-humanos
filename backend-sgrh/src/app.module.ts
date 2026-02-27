// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importamos los módulos de recursos
import { EmpleadoModule } from './empleados/empleados.module';
import { CargoModule } from './cargo/cargo.module';
import { DepartamentoModule } from './departamento/departamento.module';
import { TipoDocumentoModule } from './tipo-documento/tipo-documento.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// Importamos las entidades
import { Empleado } from './empleados/entities/empleado.entity';
import { Cargo } from './cargo/entities/cargo.entity';
import { Departamento } from './departamento/entities/departamento.entity';
import { TipoDocumento } from './tipo-documento/entities/tipo-documento.entity';
import { User } from './users/entities/user.entity';


@Module({
  imports: [
   TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Empleado, Cargo, Departamento, TipoDocumento, User],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
}),
    // Módulos de recursos
    EmpleadoModule,
    CargoModule,
    DepartamentoModule,
    TipoDocumentoModule,
    UsersModule,
    AuthModule
  ],
})
export class AppModule {}
