import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCargoDto {
  @ApiProperty({
    description: 'Nombre del cargo',
    example: 'Analista de Sistemas',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    description: 'Descripción del cargo',
    example: 'Responsable del análisis y desarrollo de sistemas informáticos.',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
