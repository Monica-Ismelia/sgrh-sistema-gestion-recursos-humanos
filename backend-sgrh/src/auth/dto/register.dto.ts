import { ApiProperty } from '@nestjs/swagger'; // Importa  ejemplo  para que los usuarios sepan el formato esperado
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'; // Importa los validadores necesarios
import { User } from 'src/users/entities/user.entity';

export class RegisterDto { // Define la clase RegisterDto
  @ApiProperty({
    name: 'name',
    required: true,
    type: String,
    description: 'Nombre completo del usuario.',
    example: 'John Doe',
  })
   @IsNotEmpty() // Valida que el campo no esté vacío
  name: string; // Define la propiedad name de tipo string

  @ApiProperty({
    name: 'email',
    required: true,
    type: String,
    description: 'Correo electrónico del usuario.',
    example: 'example@test.com',
  })
  @IsEmail() // Valida que el campo sea un correo electrónico válido
  email: string;

  @ApiProperty({
    name: 'password',
    required: true,
    type: String,
    description: 'Contraseña del usuario, mínimo 6 caracteres.',
    example: '123456',
  })
  @IsNotEmpty() // Valida que el campo no esté vacío
  @MinLength(6) // Valida que la contraseña tenga al menos 6 caracteres
  password: string;

  
}
