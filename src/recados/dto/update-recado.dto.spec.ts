import { validate } from 'class-validator';
import { UpdateRecadoDto } from './update-recado.dto';

describe('UpdateRecadoDto', () => {
  it('deve validar um DTO vazio (válido para um update)', async () => {
    const dto = {};
    const errors = await validate(Object.assign(new UpdateRecadoDto(), dto));
    expect(errors.length).toBe(0);
  });

  it('deve validar um DTO com um campo opcional (lido)', async () => {
    const dto = {
      lido: true,
    };
    const errors = await validate(Object.assign(new UpdateRecadoDto(), dto));
    expect(errors.length).toBe(0);
  });

  it('deve validar um DTO com um campo herdado (texto)', async () => {
    const dto = {
      texto: 'Recado atualizado.',
    };
    const errors = await validate(Object.assign(new UpdateRecadoDto(), dto));
    expect(errors.length).toBe(0);
  });

  it('deve falhar se o campo herdado (texto) for inválido', async () => {
    const dto = {
      texto: 'a'.repeat(300),
    };
    const errors = await validate(Object.assign(new UpdateRecadoDto(), dto));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('texto');
  });

  it('deve falhar se o campo lido não for um booleano', async () => {
    const dto = {
      lido: 'nao',
    };
    const errors = await validate(Object.assign(new UpdateRecadoDto(), dto));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('lido');
  });
});
