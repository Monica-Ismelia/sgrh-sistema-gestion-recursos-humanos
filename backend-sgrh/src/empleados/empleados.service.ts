//src/empleados/empleado.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoDocumento } from 'src/tipo-documento/entities/tipo-documento.entity';

import { Empleado } from './entities/empleado.entity';
import { Cargo } from '../cargo/entities/cargo.entity';
import { Departamento } from '../departamento/entities/departamento.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Injectable()
export class EmpleadoService {

  constructor(
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,

    @InjectRepository(Cargo)
    private cargoRepository: Repository<Cargo>,
    @InjectRepository(TipoDocumento)
        private tipoDocumentoRepository: Repository<TipoDocumento>,

    @InjectRepository(Departamento)
    private departamentoRepository: Repository<Departamento>,
  ) {}
  async create(dto: CreateEmpleadoDto) {

  // 🔴 409 – Documento duplicado
  const existeEmpleado = await this.empleadoRepository.findOneBy({
    numero_documento: dto.numero_documento,
  });

  if (existeEmpleado) {
    throw new ConflictException('El número de documento ya está registrado');
  }

  // 🔴 404 – Tipo documento
  const tipoDocumento = await this.tipoDocumentoRepository.findOneBy({
    id_tipo_documento: dto.id_tipo_documento,
  });

  if (!tipoDocumento) {
    throw new NotFoundException('Tipo de documento no encontrado');
  }

  // 🔴 404 – Cargo
  const cargo = await this.cargoRepository.findOneBy({
    id_cargo: dto.id_cargo,
  });

  if (!cargo) {
    throw new NotFoundException('Cargo no encontrado');
  }

  // 🔴 404 – Departamento
  const departamento = await this.departamentoRepository.findOneBy({
    id_departamento: dto.id_departamento,
  });

  if (!departamento) {
    throw new NotFoundException('Departamento no encontrado');
  }

  // ✅ Crear empleado
  const empleado = this.empleadoRepository.create({
    nombres: dto.nombres,
    apellidos: dto.apellidos,
    numero_documento: dto.numero_documento,
    fecha_nacimiento: dto.fecha_nacimiento,
    direccion: dto.direccion,
    telefono: dto.telefono,
    correo: dto.correo,
    estado_civil: dto.estado_civil,
    fecha_ingreso: dto.fecha_ingreso,
    tipo_documento: tipoDocumento,
    cargo,
    departamento,
  });

  return this.empleadoRepository.save(empleado);
}


  findAll() {
    return this.empleadoRepository.find({
      relations: ['cargo', 'departamento'],
    });
  }

  async findOne(id: number) {
    const empleado = await this.empleadoRepository.findOne({
      where: { id_empleado: id },
      relations: ['cargo', 'departamento'],
    });

    if (!empleado) throw new NotFoundException('Empleado no encontrado');
    return empleado;
  }

  async update(id: number, dto: UpdateEmpleadoDto) {
  const empleado = await this.findOne(id);

  if (dto.id_cargo) {
    const cargo = await this.cargoRepository.findOneBy({
      id_cargo: dto.id_cargo,
    });
    if (!cargo) {
      throw new NotFoundException('Cargo no encontrado');
    }
    empleado.cargo = cargo;
  }

  if (dto.id_departamento) {
    const departamento = await this.departamentoRepository.findOneBy({
      id_departamento: dto.id_departamento,
    });
    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado');
    }
    empleado.departamento = departamento;
  }

  Object.assign(empleado, dto);
  return this.empleadoRepository.save(empleado);
}

  async remove(id: number) {
    const empleado = await this.findOne(id);
    return this.empleadoRepository.remove(empleado);
  }
}
