import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './request-with-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    request.user = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      posts: [],
    };
    return true;
  }
}
