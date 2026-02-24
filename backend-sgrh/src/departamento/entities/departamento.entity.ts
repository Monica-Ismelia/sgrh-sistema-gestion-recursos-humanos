// src/departamento/entities/departamento.entity.ts
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { OneToMany } from 'typeorm';
@Entity('departamento')
export class Departamento {

  @PrimaryGeneratedColumn()
  id_departamento: number;

  @Column({ length: 50 })
  nombre_departamento: string;

  @OneToMany(() => Empleado, empleado => empleado.departamento)
  empleados: Empleado[];
}
