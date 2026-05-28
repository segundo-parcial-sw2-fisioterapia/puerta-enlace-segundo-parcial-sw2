import { PermisoRest } from './permisos.types';

// Las rutas más específicas van primero para que .find() retorne la regla correcta.
export const PERMISOS_REST_BI: PermisoRest[] = [
  { metodo: 'GET', ruta: '/api/bi-automatizacion/kpis/*', roles: ['director', 'administrador'] },
  { metodo: 'GET', ruta: '/api/bi-automatizacion/reportes/*', roles: ['director', 'administrador', 'contador'] },
  { metodo: 'GET', ruta: '/api/bi-automatizacion/predicciones/*', roles: ['director', 'fisioterapeuta'] },
  { metodo: 'POST', ruta: '/api/bi-automatizacion/*', roles: ['director', 'administrador'] },
];
