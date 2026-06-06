export type RolSistema =
  | 'administrador'
  | 'contador'
  | 'director'
  | 'fisioterapeuta'
  | 'paciente'
  | 'recepcionista';

/** Permiso para una operación GraphQL (query o mutation) */
export interface PermisoGraphql {
  /** Nombre exacto del campo raíz en el schema GraphQL */
  operacion: string;
  /** Roles con acceso. Array vacío = denegado para todos */
  roles: RolSistema[];
}

/** Permiso para una ruta REST del proxy */
export interface PermisoRest {
  metodo: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Patrón de ruta; acepta comodín * al final */
  ruta: string;
  roles: RolSistema[];
}
