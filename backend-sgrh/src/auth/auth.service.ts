import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create(
      dto.email,
      hashedPassword
    );

    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findOne(dto.email);

    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,  // ✅ Incluir role en el payload JWT
    };

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,  // ✅ Retornar role al frontend
    };
  }

  async findUserById(userId: number) {
    const user = await this.usersService.findById(userId);
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    return user;
  }

  async updateUser(userId: number, updateData: Partial<any>) {
    const allowedFields = ['email', 'password'];
    const updateDataFiltered: any = {};

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateDataFiltered[field] = updateData[field];
      }
    }

    if (updateDataFiltered.email) {
      const existingUser = await this.usersService.findOne(updateDataFiltered.email);
      if (existingUser && existingUser.id !== userId) {
        throw new UnauthorizedException('El email ya está en uso por otro usuario');
      }
    }

    if (updateDataFiltered.password) {
      updateDataFiltered.password = await bcrypt.hash(updateDataFiltered.password, 10);
    }

    const updatedUser = await this.usersService.update(userId, updateDataFiltered);
    
    const { password, ...result } = updatedUser;
    return result;
  }
}
