// src/cargo/dto/update-cargo.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCargoDto } from './create-cargo.dto';

export class UpdateCargoDto extends PartialType(CreateCargoDto) {

  @ApiPropertyOptional({
    description: 'Nombre del cargo (opcional al actualizar)',
    example: 'Jefe de Proyectos',
  })
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Descripción del cargo (opcional al actualizar)',
    example: 'Encargado de la supervisión de los proyectos de desarrollo.',
  })
  descripcion?: string;
}
