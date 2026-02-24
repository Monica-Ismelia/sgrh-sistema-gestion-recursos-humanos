// src/tipo-documento/dto/update-tipo-documento.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateTipoDocumentoDto } from './create-tipo-documento.dto';

export class UpdateTipoDocumentoDto extends PartialType(CreateTipoDocumentoDto) {}
