
// DTO > Data Transfer Object ( Objeto de transferencia de dados)

export class CreateTaskDto {
  readonly name: string;
  readonly description: string;
  // completed?: boolean; // O ponto de interrogação indica que este campo é opcional
}