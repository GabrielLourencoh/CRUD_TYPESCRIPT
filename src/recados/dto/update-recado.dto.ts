export class UpdateRecadoDto {
  // Uma boa pratica é deixar como readonly, para que não possa ser alterados
  readonly texto?: string; // o '?' serve para ser OPCIONAL
  readonly de?: string;
  readonly para?: string;
}
