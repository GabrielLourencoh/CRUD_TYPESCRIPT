import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRecadoDto {
  // @isNumber()
  // @isBoolean()
  // @isDate()
  //  @IsOptional
  // Uma boa pratica é deixar como readonly, para que não possa ser alterados
  @IsString() // Esse texto precisa ser uma String
  @IsNotEmpty() // Esse texto nao pode estar vazio
  @MinLength(5) // Esse texto precisa ter mais que 5 caracteres
  @MaxLength(255) // Esse texto tem o maximo de caracteres 255
  readonly texto: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  readonly de: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  readonly para: string;
}
