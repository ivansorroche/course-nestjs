
// DTO > Data Transfer Object ( Objeto de transferencia de dados)

import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @MinLength(5, { message: 'O nome deve ter no mínimo 5 caracteres' })
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;
  // completed?: boolean; // O ponto de interrogação indica que este campo é opcional
}