import { validate } from 'class-validator';
import { UpdatePessoaDto } from './update-pessoa.dto';

describe('UpdatePessoaDto', () => {
  it('deve validar um DTO vazio (válido para um update)', async () => {
    const dto = new UpdatePessoaDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve validar um DTO com um email válido', async () => {
    const dto = new UpdatePessoaDto();
    dto.email = 'gabriel@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve falhar se o email for inválido', async () => {
    const dto = new UpdatePessoaDto();
    dto.email = 'email-invalido';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('email');
  });

  it('deve falhar se a senha for muito curta', async () => {
    const dto = new UpdatePessoaDto();
    dto.password = '123'; // Senha muito curta

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('deve validar um DTO com todos os campos válidos', async () => {
    const dto = new UpdatePessoaDto();
    dto.email = 'gabriel@example.com';
    dto.password = 'senha123456';
    dto.nome = 'Gabriel Lourenco';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
