import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/schemas/users.schema';


export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // El usuario se agrega al request por el guard de JWT
  },
);