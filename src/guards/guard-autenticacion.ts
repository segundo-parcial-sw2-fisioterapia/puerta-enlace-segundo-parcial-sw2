import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard que valida el JWT en el header Authorization: Bearer ...
 * Bloquea el acceso con 401 si el token es inválido o está ausente.
 */
@Injectable()
export class GuardsAutenticacion extends AuthGuard('jwt') {}
