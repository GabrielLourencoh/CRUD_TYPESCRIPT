import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// OBS: data: unknown está assim porque pode ser que não envie e não da pra saber o tipo de dado que chegará
export const UrlParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request: Request = context.getRequest();

    return request.url;
  },
);
