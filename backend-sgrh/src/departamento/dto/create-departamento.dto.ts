// src/departamento/dto/create-departamento.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateDepartamentoDto {

  @ApiProperty({
    example: 'Contabilidad',
    description: 'Nombre del departamento',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre_departamento: string;
}
