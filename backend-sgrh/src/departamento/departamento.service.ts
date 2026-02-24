//src/departamento/departamento.service.tsimport { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departamento } from './entities/departamento.entity';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DepartamentoService {

  constructor(
    @InjectRepository(Departamento)
    private departamentoRepository: Repository<Departamento>,
  ) {}

  async create(dto: CreateDepartamentoDto): Promise<Departamento> {
    const departamento = this.departamentoRepository.create(dto);
    return this.departamentoRepository.save(departamento);
  }

  async findAll(): Promise<Departamento[]> {
    return this.departamentoRepository.find();
  }

  async findOne(id: number): Promise<Departamento> {
    const departamento = await this.departamentoRepository.findOneBy({
      id_departamento: id,
    });

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado');
    }

    return departamento;
  }

  async update(id: number, dto: UpdateDepartamentoDto): Promise<Departamento> {
    const departamento = await this.findOne(id);
    Object.assign(departamento, dto);
    return this.departamentoRepository.save(departamento);
  }

  async remove(id: number) {
    const departamento = await this.findOne(id);
    return this.departamentoRepository.remove(departamento);
  }
}
