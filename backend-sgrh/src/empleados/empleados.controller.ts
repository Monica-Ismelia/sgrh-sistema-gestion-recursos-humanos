import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request  // ✅ Importar Request (no Req)
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';

import { EmpleadoService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Empleados')
@Controller('empleados')
@UseGuards(JwtAuthGuard, RolesGuard)  // ✅ Aplica a TODOS los métodos
@ApiBearerAuth('JWT-auth')
export class EmpleadoController {

  constructor(private readonly empleadoService: EmpleadoService) {}

  // 🔒 Solo admin puede crear
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear un empleado' })
  @ApiConsumes('application/json')
  @ApiBody({ type: CreateEmpleadoDto })
  @ApiResponse({ status: 201, description: 'Empleado creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado - No tiene permisos, solo el administrador puede crear empleados' })
  @ApiResponse({ status: 404, description: 'Cargo o departamento no encontrado' })
  @ApiResponse({ status: 409, description: 'Empleado ya existe' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol admin' })
  create(@Body() dto: CreateEmpleadoDto, @Request() req) {  // ✅ req en minúscula
    console.log('Usuario creando:', req.user.email, '- Rol:', req.user.role);
    return this.empleadoService.create(dto);
  }

  // ✅ Todos los autenticados pueden leer
  @Get()
  @ApiOperation({ summary: 'Listar empleados' })
  @ApiResponse({ status: 200, description: 'Lista de empleados' })
  findAll() {
    return this.empleadoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar empleado por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Empleado encontrado' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  findOne(@Param('id') id: string) {
    return this.empleadoService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar empleado' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateEmpleadoDto })
  @ApiResponse({ status: 200, description: 'Empleado actualizado' })
      @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol admin' })
  @ApiResponse({ status: 401, description: 'No autorizado - No tiene permisos, solo el administrador puede actualizar empleados' })

  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEmpleadoDto,
  ) {
    return this.empleadoService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar empleado' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Empleado eliminado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado - No tiene permisos, solo el administrador puede eliminar empleados' })
    @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol admin' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  remove(@Param('id') id: string) {
    return this.empleadoService.remove(+id);
  }
}