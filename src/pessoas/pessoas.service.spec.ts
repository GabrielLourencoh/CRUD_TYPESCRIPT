describe('PessoasService', () => {
  beforeEach(() => {
    console.log('Isso será executado antes de cada teste');
  });

  // Caso - Teste
  it('deve somar o number1 e o number2 e resultar em 3', () => {
    // Configurar - Arrange
    const number1 = 1;
    const number2 = 2;
    // Fazer alguma ação - Act
    const result = number1 + number2;
    // Conferir se essa ação foi a esperada - Assert
    // === 3
    expect(result).toBe(3);
  });
});
