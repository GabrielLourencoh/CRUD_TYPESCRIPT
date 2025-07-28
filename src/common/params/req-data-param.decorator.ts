import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// OBS: keyof Request pega qualquer coisa que é chave da Request, o data "pega"
export const ReqDataParam = createParamDecorator(
  (data: keyof Request, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request: Request = context.getRequest();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request[data];
  },
);
