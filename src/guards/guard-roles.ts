import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CLAVE_ROLES } from './decoradores/roles.decorator';

interface UsuarioAutenticado {
  id: string;
  correo: string;
  roles: string[];
}

/**
 * Guard que verifica que request.user tenga al menos uno de los roles requeridos.
 * Debe usarse junto a GuardsAutenticacion.
 */
@Injectable()
export class GuardsRoles implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contextoEjecucion: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(
      CLAVE_ROLES,
      [contextoEjecucion.getHandler(), contextoEjecucion.getClass()],
    );

    if (!rolesRequeridos || rolesRequeridos.length === 0) {
      return true;
    }

    const { user: usuarioAutenticado } = contextoEjecucion
      .switchToHttp()
      .getRequest<{ user: UsuarioAutenticado }>();

    const tieneRol = rolesRequeridos.some((rol) =>
      usuarioAutenticado?.roles?.includes(rol),
    );

    if (!tieneRol) {
      throw new ForbiddenException(
        'No tienes los permisos necesarios para acceder a este recurso',
      );
    }

    return true;
  }
}
