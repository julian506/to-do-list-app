import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/* Decorator that returns the id of the current user based in the jwt token in the request */
export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user.sub;
  },
);
