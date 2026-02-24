//src/tipo-documento/entities/tipo-documento.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Empleado } from '../../empleados/entities/empleado.entity';
@Entity('tipo_documento')
export class TipoDocumento {

  @PrimaryGeneratedColumn()
  id_tipo_documento: number;

  @Column({ length: 30, unique: true })
  nombre_tipo_documento: string;

  @Column({ length: 150, nullable: true })
  descripcion: string;

  @OneToMany(() => Empleado, empleado => empleado.tipo_documento)
  empleados: Empleado[];
}