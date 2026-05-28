import { PermisoGraphql } from './permisos.types';

export const PERMISOS_GRAPHQL_ADMINISTRATIVA: PermisoGraphql[] = [
  // --- Empleados (RRHH) ---
  { operacion: 'listarEmpleados', roles: ['administrador', 'director', 'contador'] },
  { operacion: 'verEmpleado', roles: ['administrador', 'director', 'contador'] },
  { operacion: 'crearEmpleado', roles: ['administrador'] },
  { operacion: 'editarEmpleado', roles: ['administrador'] },
  { operacion: 'eliminarEmpleado', roles: ['administrador'] },

  // --- Sucursales ---
  { operacion: 'listarSucursales', roles: ['administrador', 'director', 'recepcionista', 'fisioterapeuta', 'contador'] },
  { operacion: 'verSucursal', roles: ['administrador', 'director', 'recepcionista', 'fisioterapeuta', 'contador'] },
  { operacion: 'crearSucursal', roles: ['administrador'] },
  { operacion: 'editarSucursal', roles: ['administrador'] },
  { operacion: 'eliminarSucursal', roles: ['administrador'] },

  // --- Horarios ---
  { operacion: 'listarHorarios', roles: ['administrador', 'director', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'verHorario', roles: ['administrador', 'director', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'crearHorario', roles: ['administrador'] },
  { operacion: 'editarHorario', roles: ['administrador'] },
  { operacion: 'eliminarHorario', roles: ['administrador'] },

  // --- Nóminas ---
  { operacion: 'listarNominas', roles: ['administrador', 'director', 'contador'] },
  { operacion: 'verNomina', roles: ['administrador', 'director', 'contador'] },
  { operacion: 'crearNomina', roles: ['administrador', 'contador'] },
  { operacion: 'editarNomina', roles: ['administrador', 'contador'] },
  { operacion: 'eliminarNomina', roles: ['administrador'] },

  // --- Inventarios ---
  { operacion: 'listarInventarios', roles: ['administrador', 'director', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'verInventario', roles: ['administrador', 'director', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'crearInventario', roles: ['administrador', 'recepcionista'] },
  { operacion: 'editarInventario', roles: ['administrador', 'recepcionista'] },
  { operacion: 'eliminarInventario', roles: ['administrador'] },

  // --- Pagos ---
  { operacion: 'listarPagos', roles: ['administrador', 'director', 'contador', 'recepcionista'] },
  { operacion: 'verPago', roles: ['administrador', 'director', 'contador', 'recepcionista'] },
  { operacion: 'crearPago', roles: ['administrador', 'recepcionista', 'contador'] },
  { operacion: 'editarPago', roles: ['administrador', 'contador'] },
  { operacion: 'eliminarPago', roles: ['administrador'] },

  // --- Facturas ---
  { operacion: 'listarFacturas', roles: ['administrador', 'director', 'contador', 'recepcionista'] },
  { operacion: 'verFactura', roles: ['administrador', 'director', 'contador', 'recepcionista'] },
  { operacion: 'crearFactura', roles: ['administrador', 'recepcionista', 'contador'] },
  { operacion: 'editarFactura', roles: ['administrador', 'contador'] },
  { operacion: 'eliminarFactura', roles: ['administrador'] },
];
