//src/tipo-documento/dto/create-tipo-documento.dto.ts// src/tipo-documento/dto/create-tipo-documento.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTipoDocumentoDto {

  @ApiProperty({
    example: 'Cédula de Ciudadanía',
    description: 'Nombre del tipo de documento',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  nombre_tipo_documento: string;

  @IsString()
    @IsNotEmpty()
    @MaxLength(150)
  @ApiProperty({
    example: 'Documento de identidad nacional expedido por el gobierno.',
    description: 'Descripción del tipo de documento',
  })
  descripcion: string;
}
