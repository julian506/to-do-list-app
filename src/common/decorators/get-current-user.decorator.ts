import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/* Decorator that returns all the info (or the field sent by parameter, if any) of the current user based in the jwt token in the request */
export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
