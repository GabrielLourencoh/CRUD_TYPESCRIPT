// Criando um contrato para quando formos usar o hash, essa classe nao será usada, será um contrato
export abstract class HashingService {
  // método abstrato de criação do hash, pegamos uma senha e retornarmos um hash
  abstract hash(password: string): Promise<string>;

  // método abstrato de comparação, onde recebe a senha e o hash, faz a comparação e retorna um boolea
  abstract compare(password: string, passwordHash: string): Promise<boolean>;
}
