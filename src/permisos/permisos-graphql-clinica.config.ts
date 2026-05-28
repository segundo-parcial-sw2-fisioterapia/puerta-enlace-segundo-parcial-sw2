import { PermisoGraphql } from './permisos.types';

export const PERMISOS_GRAPHQL_CLINICA: PermisoGraphql[] = [
  // --- Usuarios ---
  { operacion: 'listarUsuarios', roles: ['administrador'] },
  { operacion: 'verUsuario', roles: ['administrador', 'fisioterapeuta'] },
  { operacion: 'crearUsuarios', roles: ['administrador'] },
  { operacion: 'editarUsuario', roles: ['administrador'] },
  { operacion: 'inactivarUsuario', roles: ['administrador'] },
  { operacion: 'eliminarUsuario', roles: ['administrador'] },

  // --- Personas ---
  { operacion: 'listarPersonas', roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'verPersona', roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'buscarPersonas', roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'crearPersonas', roles: ['administrador', 'recepcionista'] },
  { operacion: 'editarPersona', roles: ['administrador', 'recepcionista'] },
  { operacion: 'eliminarPersona', roles: ['administrador'] },

  // --- Pacientes ---
  { operacion: 'listarPacientes', roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'verPaciente', roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'buscarPacientes', roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'crearPacientes', roles: ['administrador', 'recepcionista'] },
  { operacion: 'editarPaciente', roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'altaMedicaPaciente', roles: ['administrador', 'fisioterapeuta'] },
  { operacion: 'eliminarPaciente', roles: ['administrador'] },

  // --- Citas ---
  { operacion: 'listarCitas', roles: ['administrador', 'recepcionista', 'fisioterapeuta', 'director'] },
  { operacion: 'verCita', roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'listarCitasPorPaciente', roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'listarCitasPorEmpleadoYFecha', roles: ['fisioterapeuta', 'administrador'] },
  { operacion: 'listarCitasProximas', roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'crearCitas', roles: ['administrador', 'recepcionista'] },
  { operacion: 'editarCita', roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'confirmarCita', roles: ['administrador', 'recepcionista', 'fisioterapeuta'] },
  { operacion: 'cancelarCita', roles: ['administrador', 'recepcionista'] },
  { operacion: 'eliminarCita', roles: ['administrador'] },

  // --- Ejercicios ---
  { operacion: 'listarEjercicios', roles: ['administrador', 'fisioterapeuta', 'paciente'] },
  { operacion: 'verEjercicio', roles: ['administrador', 'fisioterapeuta', 'paciente'] },
  { operacion: 'listarEjerciciosPorCategoria', roles: ['fisioterapeuta', 'paciente', 'administrador'] },
  { operacion: 'crearEjercicios', roles: ['administrador', 'fisioterapeuta'] },
  { operacion: 'editarEjercicio', roles: ['administrador', 'fisioterapeuta'] },
  { operacion: 'eliminarEjercicio', roles: ['administrador'] },

  // --- Evaluaciones Iniciales ---
  { operacion: 'listarEvaluacionesIniciales', roles: ['administrador', 'fisioterapeuta', 'director'] },
  { operacion: 'verEvaluacionInicial', roles: ['administrador', 'fisioterapeuta'] },
  { operacion: 'listarEvaluacionesPorPaciente', roles: ['administrador', 'fisioterapeuta'] },
  { operacion: 'crearEvaluacionesIniciales', roles: ['fisioterapeuta'] },
  { operacion: 'editarEvaluacionInicial', roles: ['fisioterapeuta', 'administrador'] },
  { operacion: 'eliminarEvaluacionInicial', roles: ['administrador'] },

  // --- Planes de Tratamiento ---
  { operacion: 'listarPlanesTratamientos', roles: ['administrador', 'fisioterapeuta', 'director'] },
  { operacion: 'verPlanTratamiento', roles: ['administrador', 'fisioterapeuta'] },
  { operacion: 'listarPlanesPorPaciente', roles: ['administrador', 'fisioterapeuta'] },
  { operacion: 'crearPlanesTratamientos', roles: ['fisioterapeuta'] },
  { operacion: 'editarPlanTratamiento', roles: ['fisioterapeuta', 'administrador'] },
  { operacion: 'eliminarPlanTratamiento', roles: ['administrador'] },

  // --- Planes de Ejercicios ---
  { operacion: 'listarPlanesEjercicios', roles: ['administrador', 'fisioterapeuta'] },
  { operacion: 'verPlanEjercicio', roles: ['administrador', 'fisioterapeuta', 'paciente'] },
  { operacion: 'listarEjerciciosDePlan', roles: ['fisioterapeuta', 'paciente', 'administrador'] },
  { operacion: 'crearPlanesEjercicios', roles: ['fisioterapeuta'] },
  { operacion: 'editarPlanEjercicio', roles: ['fisioterapeuta', 'administrador'] },
  { operacion: 'eliminarPlanEjercicio', roles: ['administrador'] },

  // --- Sesiones Clínicas ---
  { operacion: 'listarSesiones', roles: ['administrador', 'fisioterapeuta', 'director'] },
  { operacion: 'verSesion', roles: ['administrador', 'fisioterapeuta'] },
  { operacion: 'listarSesionesPorPaciente', roles: ['administrador', 'fisioterapeuta'] },
  { operacion: 'crearSesiones', roles: ['fisioterapeuta'] },
  { operacion: 'editarSesion', roles: ['fisioterapeuta'] },
  { operacion: 'cerrarYFirmarSesion', roles: ['fisioterapeuta'] },
  { operacion: 'eliminarSesion', roles: ['administrador'] },

  // --- Sesiones Domiciliarias ---
  { operacion: 'listarSesionesDomiciliarias', roles: ['administrador', 'fisioterapeuta', 'director'] },
  { operacion: 'verSesionDomiciliaria', roles: ['administrador', 'fisioterapeuta', 'paciente'] },
  { operacion: 'listarSesionesDomiciliariasPorPaciente', roles: ['fisioterapeuta', 'administrador', 'paciente'] },
  { operacion: 'crearSesionesDomiciliarias', roles: ['paciente', 'fisioterapeuta'] },
  { operacion: 'editarSesionDomiciliaria', roles: ['fisioterapeuta', 'administrador'] },
  { operacion: 'eliminarSesionDomiciliaria', roles: ['administrador'] },
];
