import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateTaskDto {
  @IsString()
  @MinLength(5, { message: 'O nome deve ter no mínimo 5 caracteres' })
  @IsOptional()
  readonly name?: string;

  @IsString()
  @MinLength(5, { message: 'O nome deve ter no mínimo 5 caracteres' })
  @IsOptional()
  readonly description?: string;

  @IsBoolean()
  @IsOptional()
  readonly completed?: boolean; // O ponto de interrogação indica que este campo é opcional
}