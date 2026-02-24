
// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;  // ✅ Cambiado de username a email

  @Column()
  password: string;
  
  // Campo de rol
  @Column({ 
    type: 'enum',
    enum: ['admin', 'user'],
     default: 'user',
     nullable:false
  })
  role: string;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}