//src/departamento/dto/update-departamento.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { CreateDepartamentoDto } from './create-departamento.dto';

export class UpdateDepartamentoDto extends PartialType(CreateDepartamentoDto) {

  @ApiPropertyOptional({ example: 'Recursos Humanos' })
  @IsString()
  @MaxLength(50)
  nombre_departamento?: string;
}
