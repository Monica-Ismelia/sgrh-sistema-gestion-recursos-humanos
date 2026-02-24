import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Body, 
  UsePipes, 
  ValidationPipe, 
  HttpStatus,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { 
  ApiBody, 
  ApiOperation, 
  ApiResponse, 
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  // 📡 PÚBLICO - Registrar
  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema.'
  })
  @ApiBody({ 
    type: RegisterDto, 
    description: 'Datos necesarios para registrar un usuario.' 
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Usuario registrado exitosamente.' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos o faltantes.' 
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // 📡 PÚBLICO - Login
  @Post('login')
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Permite a un usuario registrado iniciar sesión.' 
  })
  @ApiBody({ 
    type: LoginDto, 
    description: 'Credenciales necesarias para iniciar sesión.' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Inicio de sesión exitoso. Token generado.' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Credenciales incorrectas.' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Formato de datos inválido.' 
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // 🔒 PROTEGIDO - Obtener mi perfil completo
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener mi perfil completo',
    description: 'Obtiene toda la información del usuario autenticado incluyendo fecha de ingreso.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Datos completos del usuario.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token inválido.' 
  })
  async getProfile(@Request() req) {
    const user = await this.authService.findUserById(req.user.userId);
    
    // ✅ getProfile SÍ necesita eliminar password (porque findUserById lo retorna completo)
    const { password, ...result } = user;
    return result;
  }

  // 🔒 PROTEGIDO - Actualizar mi perfil
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Actualizar mi perfil',
    description: 'Actualiza email y/o contraseña. La fecha de ingreso NO se puede modificar.'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { 
          type: 'string', 
          example: 'nuevo@email.com',
          description: 'Nuevo correo electrónico (opcional)'
        },
        password: { 
          type: 'string', 
          example: 'nuevaContraseña123',
          description: 'Nueva contraseña (mínimo 6 caracteres, opcional)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil actualizado correctamente.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos.' 
  })
  // ✅ CORREGIDO: Sin destructuración de password (el service ya lo hace)
  async updateProfile(@Request() req, @Body() updateDto: Partial<RegisterDto>) {
    return await this.authService.updateUser(req.user.userId, updateDto);
  }
}