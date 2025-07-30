export class UpdateTaskDto {
  readonly name?: string;
  readonly description?: string;
  readonly completed?: boolean; // O ponto de interrogação indica que este campo é opcional
}