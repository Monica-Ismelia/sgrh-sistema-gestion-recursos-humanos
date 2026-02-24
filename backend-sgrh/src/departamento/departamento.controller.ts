import {
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
  Request  // ✅ Para auditoría
} from '@nestjs/common';
import {
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam, 
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { DepartamentoService } from './departamento.service';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';  // ✅ Importar
import { Roles } from '../common/decorators/roles.decorator';  // ✅ Importar

@ApiTags('Departamento')
@Controller('departamento')
@UseGuards(JwtAuthGuard, RolesGuard)  // ✅ Ambos guards
@ApiBearerAuth('JWT-auth')
export class DepartamentoController {

  constructor(private readonly departamentoService: DepartamentoService) {}

  // 🔒 Solo admin puede crear departamentos
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear un departamento' })
  @ApiConsumes('application/json')
  @ApiBody({ type: CreateDepartamentoDto })
  @ApiResponse({ status: 201, description: 'Departamento creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol admin' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  create(@Body() dto: CreateDepartamentoDto, @Request() req) {
    console.log(`[AUDITORIA] Admin ${req.user.email} creó departamento`);
    return this.departamentoService.create(dto);
  }

  // ✅ Todos los autenticados pueden leer
  @Get()
  @ApiOperation({ summary: 'Listar departamentos' })
  @ApiResponse({ status: 200, description: 'Lista de departamentos' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  findAll() {
    return this.departamentoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar departamento por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Departamento encontrado' })
  @ApiResponse({ status: 404, description: 'Departamento no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  findOne(@Param('id') id: string) {
    return this.departamentoService.findOne(+id);
  }

  // 🔒 Solo admin puede actualizar departamentos
  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar departamento' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateDepartamentoDto })
  @ApiResponse({ status: 200, description: 'Departamento actualizado' })
  @ApiResponse({ status: 404, description: 'Departamento no encontrado' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol admin' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDepartamentoDto,
    @Request() req
  ) {
    console.log(`[AUDITORIA] Admin ${req.user.email} actualizó departamento ID: ${id}`);
    return this.departamentoService.update(+id, dto);
  }

  // 🔒 Solo admin puede eliminar departamentos
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar departamento' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Departamento eliminado' })
  @ApiResponse({ status: 404, description: 'Departamento no encontrado' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol admin' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  remove(@Param('id') id: string, @Request() req) {
    console.log(`[AUDITORIA] Admin ${req.user.email} eliminó departamento ID: ${id}`);
    return this.departamentoService.remove(+id);
  }
}