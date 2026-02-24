import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    name: 'email',
    required: true,
    type: String,
    description: 'Correo electrónico registrado en el sistema.',
    example: 'example@test.com',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    name: 'password',
    required: true,
    type: String,
    description: 'Contraseña asociada al usuario. Debe tener mínimo 6 caracteres.',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
