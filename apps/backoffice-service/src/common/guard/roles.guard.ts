/* eslint-disable no-console */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Si no se especifican roles, se permite el acceso
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('roles guard user --->', user); // Agregado para depuración
    if (!user || !user.roles) {
      throw new ForbiddenException('Acceso denegado: No se encontraron roles.');
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        'Acceso denegado: No tienes los roles necesarios.',
      );
    }

    return true;
  }
}
