import { PermisoGraphql } from './permisos.types';

export const PERMISOS_GRAPHQL_BI: PermisoGraphql[] = [
  { operacion: 'predecirTiempoRecuperacion', roles: ['fisioterapeuta', 'director', 'administrador'] },
  { operacion: 'predecirRiesgoAbandono', roles: ['fisioterapeuta', 'director', 'administrador'] },
  { operacion: 'dashboardKpis', roles: ['director', 'administrador'] },
  { operacion: 'registrarEvento', roles: ['director', 'administrador', 'fisioterapeuta', 'recepcionista', 'contador'] },
];
