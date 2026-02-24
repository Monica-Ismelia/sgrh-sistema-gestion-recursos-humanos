import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Request
} from '@nestjs/common';
import { CargoService } from './cargo.service';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Cargos')
@Controller('cargo')
@UseGuards(JwtAuthGuard, RolesGuard)  // ✅ Ambos guards a nivel de clase
@ApiBearerAuth('JWT-auth')
export class CargoController {
  constructor(private readonly cargoService: CargoService) {}

  // 🔒 Solo admin puede crear cargos
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear un nuevo cargo' })
  @ApiBody({ type: CreateCargoDto })
  @ApiResponse({ status: 201, description: 'Cargo creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol admin' })
  create(@Body() createCargoDto: CreateCargoDto, @Request() req) {
    console.log(`[AUDITORIA] Admin ${req.user.email} creó cargo`);
    return this.cargoService.create(createCargoDto);
  }

  // ✅ Todos los usuarios autenticados pueden leer
  @Get()
  @ApiOperation({ summary: 'Obtener todos los cargos' })
  @ApiResponse({ status: 200, description: 'Lista de cargos obtenida exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  findAll() {
    return this.cargoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cargo por su ID' })
  @ApiParam({ name: 'id', description: 'ID del cargo', example: 1 })
  @ApiResponse({ status: 200, description: 'Cargo encontrado.' })
  @ApiResponse({ status: 404, description: 'Cargo no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  findOne(@Param('id') id: string) {
    return this.cargoService.findOne(+id);
  }

  // 🔒 Solo admin puede actualizar cargos
  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar un cargo existente' })
  @ApiParam({ name: 'id', description: 'ID del cargo', example: 1 })
  @ApiBody({ type: UpdateCargoDto })
  @ApiResponse({ status: 200, description: 'Cargo actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cargo no encontrado.' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol admin' })
  update(@Param('id') id: string, @Body() updateCargoDto: UpdateCargoDto, @Request() req) {
    console.log(`[AUDITORIA] Admin ${req.user.email} actualizó cargo ID: ${id}`);
    return this.cargoService.update(+id, updateCargoDto);
  }

  // 🔒 Solo admin puede eliminar cargos
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar un cargo por su ID' })
  @ApiParam({ name: 'id', description: 'ID del cargo', example: 1 })
  @ApiResponse({ status: 200, description: 'Cargo eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cargo no encontrado.' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol admin' })
  remove(@Param('id') id: string, @Request() req) {
    console.log(`[AUDITORIA] Admin ${req.user.email} eliminó cargo ID: ${id}`);
    return this.cargoService.remove(+id);
  }
}
