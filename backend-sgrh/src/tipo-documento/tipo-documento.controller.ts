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
import { TipoDocumentoService } from './tipo-documento.service';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo-documento.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';  // ✅ Importar
import { Roles } from '../common/decorators/roles.decorator';  // ✅ Importar

@ApiTags('Tipos de Documento')
@Controller('tipo-documento')
@UseGuards(JwtAuthGuard, RolesGuard)  // ✅ Ambos guards
@ApiBearerAuth('JWT-auth')
export class TipoDocumentoController {
  constructor(private readonly tipoDocumentoService: TipoDocumentoService) {}

  // 🔒 Solo admin puede crear tipos de documento
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear un nuevo tipo de documento' })
  @ApiConsumes('application/json')
  @ApiBody({ type: CreateTipoDocumentoDto })
  @ApiResponse({ status: 201, description: 'Tipo de documento creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol admin' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  create(@Body() dto: CreateTipoDocumentoDto, @Request() req) {
    console.log(`[AUDITORIA] Admin ${req.user.email} creó tipo de documento`);
    return this.tipoDocumentoService.create(dto);
  }

  // ✅ Todos los autenticados pueden leer
  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de documento' })
  @ApiResponse({ status: 200, description: 'Listado de tipos de documento' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  findAll() {
    return this.tipoDocumentoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de documento por su ID' })
  @ApiResponse({ status: 200, description: 'Tipo de documento encontrado' })
  @ApiResponse({ status: 404, description: 'Tipo de documento no encontrado' })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  findOne(@Param('id') id: string) {
    return this.tipoDocumentoService.findOne(+id);
  }

  // 🔒 Solo admin puede actualizar tipos de documento
  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar un tipo de documento por su ID' })
  @ApiBody({ type: UpdateTipoDocumentoDto })
  @ApiResponse({ status: 200, description: 'Tipo de documento actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Tipo de documento no encontrado' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol admin' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTipoDocumentoDto,
    @Request() req
  ) {
    console.log(`[AUDITORIA] Admin ${req.user.email} actualizó tipo documento ID: ${id}`);
    return this.tipoDocumentoService.update(+id, dto);
  }

  // 🔒 Solo admin puede eliminar tipos de documento
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar un tipo de documento por su ID' })
  @ApiResponse({ status: 200, description: 'Tipo de documento eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Tipo de documento no encontrado' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol admin' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  remove(@Param('id') id: string, @Request() req) {
    console.log(`[AUDITORIA] Admin ${req.user.email} eliminó tipo documento ID: ${id}`);
    return this.tipoDocumentoService.remove(+id);
  }
}