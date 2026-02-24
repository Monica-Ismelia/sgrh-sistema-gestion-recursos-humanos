

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TipoDocumento } from './entities/tipo-documento.entity';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo-documento.dto';

@Injectable()
export class TipoDocumentoService {
  constructor(
    @InjectRepository(TipoDocumento)
    private tipoDocumentoRepository: Repository<TipoDocumento>,
  ) {}

  // ✅ Crear tipo de documento
  async create(dto: CreateTipoDocumentoDto) {
    const existe = await this.tipoDocumentoRepository.findOneBy({
      nombre_tipo_documento: dto.nombre_tipo_documento,
    });

    if (existe) {
      throw new ConflictException(
        'El tipo de documento ya existe',
      );
    }

    const tipoDocumento =
      this.tipoDocumentoRepository.create(dto);

    return this.tipoDocumentoRepository.save(tipoDocumento);
  }

  // ✅ Listar todos
  findAll() {
    return this.tipoDocumentoRepository.find();
  }

  // ✅ Buscar por ID
  async findOne(id: number) {
    const tipoDocumento =
      await this.tipoDocumentoRepository.findOneBy({
        id_tipo_documento: id,
      });

    if (!tipoDocumento) {
      throw new NotFoundException(
        'Tipo de documento no encontrado',
      );
    }

    return tipoDocumento;
  }

  // ✅ Actualizar
  async update(
    id: number,
    dto: UpdateTipoDocumentoDto,
  ) {
    const tipoDocumento = await this.findOne(id);

    Object.assign(tipoDocumento, dto);
    return this.tipoDocumentoRepository.save(tipoDocumento);
  }

  // ✅ Eliminar
  async remove(id: number) {
    const tipoDocumento = await this.findOne(id);
    return this.tipoDocumentoRepository.remove(tipoDocumento);
  }
}
