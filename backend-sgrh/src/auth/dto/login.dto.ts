import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
/** 
 * Data transfer Object (DTO) for user authentucation.
 * Defines validation  for email and password during login.
 */

export class LoginDto {
  /**
   *  Email of user for login
   */
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
    /**
 * Password for authentication.
 */
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
