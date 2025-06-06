export class CreateRecadoDto {
  // Uma boa pratica é deixar como readonly, para que não possa ser alterados
  readonly texto: string;
  readonly de: string;
  readonly para: string;
}
