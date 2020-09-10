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

  static CalculaTamanhoImagemBase64(base64String: string) {
    let padding;
    let inBytes;
    let base64StringLength;
    let kbytes;
    if (base64String.endsWith('==')) { padding = 2; } else if (base64String.endsWith('=')) { padding = 1; } else { padding = 0; }

    base64StringLength = base64String.length;
    inBytes = (base64StringLength / 4 ) * 3 - padding;
    kbytes = inBytes / 1000;
    return kbytes;
  }

  static RedimensionarImagem(src, newX, newY) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL();
        res(data);
      };
      img.onerror = error => rej(error);
    });
  }
}
