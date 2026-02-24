// src/cargo/entities/cargo.entity.ts
// src/cargo/entities/cargo.entity.ts
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { OneToMany } from 'typeorm';

@Entity('cargo')
export class Cargo {

  @PrimaryGeneratedColumn()
  id_cargo: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;
  @OneToMany(() => Empleado, empleado => empleado.cargo)
empleados: Empleado[];

}

