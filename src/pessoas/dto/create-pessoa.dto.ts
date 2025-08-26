import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePessoaDto {
  @IsEmail()
  email: string;

  // @IsStrongPassword() -> Poderiamos usar isso para validar a senha
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
  // Password não é o msm que o passwordHash, para nao salvar no banco de dados

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  nome: string;

  // each: true -> nos permite receber vários.
  // @IsEnum(RoutePolicies, { each: true })
  // routePolicies: RoutePolicies[];
}
