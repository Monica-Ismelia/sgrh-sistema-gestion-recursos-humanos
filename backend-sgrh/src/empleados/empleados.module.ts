import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Empleado } from './entities/empleado.entity';
import { Cargo } from '../cargo/entities/cargo.entity';
import { Departamento } from '../departamento/entities/departamento.entity';
import { TipoDocumento } from '../tipo-documento/entities/tipo-documento.entity';

import { EmpleadoService } from './empleados.service';
import { EmpleadoController } from './empleados.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Empleado, Cargo, Departamento, TipoDocumento]),
  ],
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
})
export class EmpleadoModule {}
