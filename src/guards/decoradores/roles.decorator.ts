import { SetMetadata } from '@nestjs/common';

export const CLAVE_ROLES = 'roles';

/** Declara los roles requeridos en un endpoint o controlador. */
export const Roles = (...rolesRequeridos: string[]) =>
  SetMetadata(CLAVE_ROLES, rolesRequeridos);
