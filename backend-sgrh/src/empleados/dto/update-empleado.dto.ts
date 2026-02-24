//src/empleados/dto/update-empleado.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateEmpleadoDto } from './create-empleado.dto';

export class UpdateEmpleadoDto extends PartialType(CreateEmpleadoDto) {}
