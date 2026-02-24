import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cargo } from './entities/cargo.entity';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';

@Injectable()
export class CargoService {
  constructor(
    @InjectRepository(Cargo)
    private readonly cargoRepository: Repository<Cargo>,
  ) {}

  async create(createCargoDto: CreateCargoDto): Promise<Cargo> {
    const cargo = this.cargoRepository.create(createCargoDto);
    return await this.cargoRepository.save(cargo);
  }

  async findAll(): Promise<Cargo[]> {
    return await this.cargoRepository.find();
  }

  async findOne(id: number): Promise<Cargo> {
    const cargo = await this.cargoRepository.findOneBy({ id_cargo: id });

    if (!cargo) {
      throw new NotFoundException('Cargo no encontrado');
    }

    return cargo;
  }

  async update(id: number, updateCargoDto: UpdateCargoDto): Promise<Cargo> {
    const cargo = await this.findOne(id);

    Object.assign(cargo, updateCargoDto);
    return await this.cargoRepository.save(cargo);
  }

  async remove(id: number) {
    const cargo = await this.findOne(id);
    return await this.cargoRepository.remove(cargo);
  }
}
