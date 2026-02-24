//src/empleados/dto/create-empleado.dto.ts
import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsEmail,
  IsNumber,
  IsDateString,
  IsInt,
  IsNotEmpty,
  isInt,
} from 'class-validator';

export class CreateEmpleadoDto {

  @ApiProperty({ example: 'María' })
  @IsString()
  nombres: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  apellidos: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  numero_documento: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_tipo_documento: number;

  @ApiProperty({ example: '1990-05-12' })
  @IsDateString()
  fecha_nacimiento: string;

  @ApiProperty({ example: 'Calle 10 #20-30' })
  @IsString()
  direccion: string;

  @ApiProperty({ example: '3001234567' })
  @IsString()
  telefono: string;

  @ApiProperty({ example: 'maria@email.com' })
  @IsEmail()
  correo: string;

  @ApiProperty({ example: 'Soltera' })
  @IsString()
  estado_civil: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  fecha_ingreso: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  id_cargo: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  id_departamento: number;
}
