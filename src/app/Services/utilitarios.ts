export class Utilitarios {
  static CalculaMonetario(valor: string, insercao: boolean) {
    if (!insercao) {
      if (valor.indexOf('.') === -1) {
        valor += '.00';
      } else if (valor.substring(valor.length - 3).substring(0, 1) !== '.') {
        valor += 0;
      }
    }

    valor = valor.replace('.', '');
    valor = valor.replace(',', '.');
    const numero: number = +valor;
    if (!isNaN(numero)) {
      valor = (numero / 100).toString();
      if (valor.indexOf('.') === -1) {
        valor += '.00';
      } else if (valor.substring(valor.length - 3).substring(0, 1) !== '.') {
        valor += 0;
      }
    } else {
      valor = 'Número Inválido';
    }
    return valor;
  }
}
