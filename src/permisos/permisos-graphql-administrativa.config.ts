import { PermisoGraphql } from './permisos.types';

export const PERMISOS_GRAPHQL_ADMINISTRATIVA: PermisoGraphql[] = [

  // ─── Tarifas ─────────────────────────────────────────────────────────────────
  { operacion: 'listarTarifas',    roles: ['administrador', 'contador', 'director', 'fisioterapeuta'] },
  { operacion: 'verTarifa',        roles: ['administrador', 'contador', 'fisioterapeuta'] },
  { operacion: 'actualizarTarifa', roles: ['administrador', 'fisioterapeuta'] },

  // ─── Mensualidades ───────────────────────────────────────────────────────────
  { operacion: 'listarMensualidades',             roles: ['administrador', 'contador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'listarMensualidadesEnriquecidas', roles: ['administrador', 'contador', 'recepcionista'] },
  { operacion: 'verMensualidad',                  roles: ['administrador', 'contador', 'recepcionista'] },
  { operacion: 'listarMensualidadesPorPaciente',  roles: ['administrador', 'contador', 'recepcionista'] },
  { operacion: 'listarMensualidadesPorPlan',      roles: ['administrador', 'contador', 'fisioterapeuta'] },
  { operacion: 'listarMensualidadesPendientes',   roles: ['administrador', 'contador', 'recepcionista'] },
  { operacion: 'crearMensualidades',              roles: ['administrador', 'contador', 'fisioterapeuta'] },
  { operacion: 'registrarPagoMensualidad',        roles: ['recepcionista', 'contador', 'administrador'] },

  // ─── Facturas ────────────────────────────────────────────────────────────────
  { operacion: 'listarFacturas',               roles: ['administrador', 'director', 'contador'] },
  { operacion: 'listarFacturasEnriquecidas',   roles: ['administrador', 'director', 'contador', 'recepcionista'] },
  { operacion: 'verFactura',                   roles: ['administrador', 'director', 'contador', 'recepcionista'] },
  { operacion: 'verFacturaEnriquecida',        roles: ['administrador', 'director', 'contador', 'recepcionista'] },
  { operacion: 'listarFacturasPorPaciente',    roles: ['administrador', 'contador', 'recepcionista'] },
  { operacion: 'listarFacturasPorMensualidad', roles: ['administrador', 'contador'] },
  { operacion: 'anularFactura',                roles: ['administrador'] },
  { operacion: 'registrarFacturaEnBlockchain', roles: ['administrador', 'contador'] },
  { operacion: 'generarPdfFactura',            roles: ['administrador', 'director', 'contador', 'recepcionista'] },

  // ─── Empleados ───────────────────────────────────────────────────────────────
  // buscarEmpleados también lo necesitan módulos de clínica para el selector FK
  { operacion: 'listarEmpleados',          roles: ['administrador', 'director', 'contador', 'fisioterapeuta'] },
  { operacion: 'verEmpleado',              roles: ['administrador', 'director', 'contador', 'fisioterapeuta'] },
  { operacion: 'verEmpleadoPorPersonaId',  roles: ['administrador', 'director', 'contador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'buscarEmpleados',          roles: ['administrador', 'director', 'contador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'crearEmpleados',           roles: ['administrador', 'fisioterapeuta'] },
  { operacion: 'editarEmpleado',           roles: ['administrador', 'fisioterapeuta'] },
  { operacion: 'eliminarEmpleado',         roles: ['administrador', 'fisioterapeuta'] },

  // ─── Turnos ──────────────────────────────────────────────────────────────────
  { operacion: 'listarTurnos',            roles: ['administrador', 'director'] },
  { operacion: 'verTurno',                roles: ['administrador', 'director'] },
  { operacion: 'listarTurnosPorEmpleado', roles: ['administrador', 'director', 'fisioterapeuta'] },
  { operacion: 'crearTurnos',             roles: ['administrador'] },
  { operacion: 'editarTurno',             roles: ['administrador'] },
  { operacion: 'eliminarTurno',           roles: ['administrador'] },

  // ─── Asistencias ─────────────────────────────────────────────────────────────
  { operacion: 'listarAsistencias',             roles: ['administrador', 'director', 'contador', 'fisioterapeuta'] },
  { operacion: 'verAsistencia',                 roles: ['administrador', 'director', 'contador', 'fisioterapeuta'] },
  { operacion: 'listarAsistenciasPorEmpleado',  roles: ['administrador', 'director', 'contador', 'fisioterapeuta'] },
  { operacion: 'crearAsistencias',              roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'editarAsistencia',              roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'eliminarAsistencia',            roles: ['administrador', 'fisioterapeuta'] },

  // ─── Insumos (Inventario) ────────────────────────────────────────────────────
  { operacion: 'listarInsumos',             roles: ['administrador', 'director', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'verInsumo',                 roles: ['administrador', 'director', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'listarInsumosConStockBajo', roles: ['administrador', 'director', 'recepcionista'] },
  { operacion: 'crearInsumos',              roles: ['administrador', 'recepcionista'] },
  { operacion: 'editarInsumo',              roles: ['administrador', 'recepcionista'] },
  { operacion: 'eliminarInsumo',            roles: ['administrador'] },

  // ─── Movimientos de Insumos ──────────────────────────────────────────────────
  { operacion: 'listarMovimientosInsumos',    roles: ['administrador', 'director', 'recepcionista'] },
  { operacion: 'verMovimientoInsumo',         roles: ['administrador', 'director', 'recepcionista'] },
  { operacion: 'listarMovimientosPorInsumo',  roles: ['administrador', 'director', 'recepcionista'] },
  { operacion: 'crearMovimientosInsumos',     roles: ['administrador', 'recepcionista'] },
  { operacion: 'eliminarMovimientoInsumo',    roles: ['administrador'] },

  // ─── Documentos ──────────────────────────────────────────────────────────────
  { operacion: 'listarDocumentos',              roles: ['administrador', 'director', 'contador'] },
  { operacion: 'verDocumento',                  roles: ['administrador', 'director', 'contador'] },
  { operacion: 'listarDocumentosPorEntidad',    roles: ['administrador', 'director', 'contador'] },
  { operacion: 'crearDocumentos',               roles: ['administrador'] },
  { operacion: 'editarDocumento',               roles: ['administrador'] },
  { operacion: 'eliminarDocumento',             roles: ['administrador'] },
  { operacion: 'firmarDocumentoConBlockchain',  roles: ['administrador'] },

  // ─── Reportes (BI Administrativo) ────────────────────────────────────────────
  { operacion: 'reporteFinanciero',    roles: ['administrador', 'director', 'contador'] },
  { operacion: 'catalogoReportes',     roles: ['administrador', 'director', 'contador'] },
  { operacion: 'reporteDinamico',      roles: ['administrador', 'director', 'contador'] },
  { operacion: 'reportePorPrompt',     roles: ['administrador', 'director', 'contador'] },
  { operacion: 'exportarReportePdf',   roles: ['administrador', 'director', 'contador'] },
  { operacion: 'exportarReporteExcel', roles: ['administrador', 'director', 'contador'] },
];
