// src/empleados/entities/empleado.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { Departamento } from '../../departamento/entities/departamento.entity';
import { TipoDocumento } from '../../tipo-documento/entities/tipo-documento.entity';

@Entity('empleado')
export class Empleado {

  @PrimaryGeneratedColumn()
  id_empleado: number;

  @Column({ length: 50 })
  nombres: string;

  @Column({ length: 50 })
  apellidos: string;

  @Column({ length: 20, unique: true })
  numero_documento: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;

  @Column({ length: 100, nullable: true })
  direccion: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 50, unique: true })
  correo: string;

  @Column({ length: 20, nullable: true })
  estado_civil: string;

  @Column({ type: 'date', nullable: true })
  fecha_ingreso: Date;

  @ManyToOne(() => Cargo, { eager: true })
  @JoinColumn({ name: 'id_cargo' })
  cargo: Cargo;

  @ManyToOne(() => Departamento, { eager: true })
  @JoinColumn({ name: 'id_departamento' })
  departamento: Departamento;

@ManyToOne(() => TipoDocumento, { eager: true })
@JoinColumn({ name: 'id_tipo_documento' })
tipo_documento: TipoDocumento;


}
