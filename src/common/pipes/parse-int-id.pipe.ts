import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  // esse transform ja vem pronto
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value;
    }

    const parsedValue = Number(value); // Transformando valor de string para number

    // Validando de valor
    if (isNaN(parsedValue)) {
      throw new BadRequestException(
        'ParseIntIdPipe espera uma string numérica ',
      );
    }

    // Validando de valor
    if (parsedValue < 0) {
      throw new BadRequestException(
        'ParseIntIdPipe espera um número maior do que zero',
      );
    }

    return parsedValue;
  }
}
