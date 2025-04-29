import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersDBService } from '../db-module/users.service'; // Importa el servicio

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly userDbService: UsersDBService) {} // Inyecta el servicio

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key']; // Leer la API key del encabezado

    if (!apiKey) {
      throw new UnauthorizedException('API key no proporcionada');
    }

    // Validar la API key usando el servicio
    const user = await this.userDbService.findUserByApiKey(apiKey);
    if (!user) {
      throw new UnauthorizedException('API key inválida');
    }

    // Puedes agregar el usuario al objeto de la solicitud para usarlo más adelante
    request.user = user;

    return true; // Permitir el acceso si la API key es válida
  }
}
