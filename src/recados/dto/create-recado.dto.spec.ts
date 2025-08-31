import { validate } from 'class-validator';
import { CreateRecadoDto } from './create-recado.dto';

describe('CreateRecadoDto', () => {
  it('deve validar um DTO válido', async () => {
    const dto = {
      texto: 'Recado de teste válido.',
      paraId: 1,
    };

    const errors = await validate(Object.assign(new CreateRecadoDto(), dto));
    expect(errors.length).toBe(0);
  });

  it('deve falhar se o texto for vazio', async () => {
    const dto = {
      texto: '',
      paraId: 1,
    };

    const errors = await validate(Object.assign(new CreateRecadoDto(), dto));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('texto');
  });

  it('deve falhar se o texto for muito curto', async () => {
    const dto = {
      texto: 'oi',
      paraId: 1,
    };

    const errors = await validate(Object.assign(new CreateRecadoDto(), dto));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('texto');
  });

  it('deve falhar se o texto for muito longo', async () => {
    const dto = {
      texto: 'a'.repeat(300),
      paraId: 1,
    };

    const errors = await validate(Object.assign(new CreateRecadoDto(), dto));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('texto');
  });

  it('deve falhar se paraId não for um número positivo', async () => {
    const dto = {
      texto: 'Recado de teste.',
      paraId: -1,
    };

    const errors = await validate(Object.assign(new CreateRecadoDto(), dto));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('paraId');
  });
});
