import { HashingService } from './hashing.service';
import * as bcrypt from 'bcryptjs';

// Criando a classe que cumpri com as regras do HashingService. Para caso precisarmos trocar o bcrypt para outro serviço, o contrato é o msm
export class BcryptService extends HashingService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(); // GEra um salt
    return bcrypt.hash(password, salt); // Gera um hash de senha
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash); // true === logado, false === errado
  }
}
