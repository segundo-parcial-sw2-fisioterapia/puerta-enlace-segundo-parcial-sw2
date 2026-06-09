import { Controller, Req, Res, All, Logger, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { GuardsAutenticacion } from '../guards/guard-autenticacion';
import { GuardPermisos } from '../guards/guard-permisos';

@Controller('graphql')
export class GraphqlGatewayController {
  private readonly logger = new Logger('GraphqlGateway');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Extrae el nombre del campo raíz de la consulta/mutación GraphQL.
   * Por ejemplo: de "query { listarCitas { id } }" extrae "listarCitas".
   */
  private obtenerNombreOperacion(query: string): string {
    if (!query) return '';
    try {
      // 1. Remover comentarios
      let q = query.replace(/#.*$/gm, ' ');
      // 2. Remover todo lo que esté entre paréntesis para evitar confundir argumentos con campos
      q = q.replace(/\([^)]*\)/g, ' ');
      // 3. Buscar la primera llave de apertura '{'
      const indexLlave = q.indexOf('{');
      if (indexLlave === -1) return '';
      // 4. El resto de la query después de la primera llave
      const resto = q.substring(indexLlave + 1).trim();
      // 5. La primera palabra alfanumérica es el nombre del query/mutation raíz
      const match = resto.match(/^([a-zA-Z0-9_]+)/);
      return match ? match[1] : '';
    } catch (e) {
      this.logger.error(`Error al analizar la query GraphQL: ${e.message}`);
      return '';
    }
  }

  /**
   * Recibe todas las peticiones GraphQL dirigidas a la puerta de enlace,
   * y las enruta dinámicamente al microservicio correspondiente.
   */
  @UseGuards(GuardsAutenticacion, GuardPermisos)
  @All()
  async handleGraphql(@Req() req: Request, @Res() res: Response) {
    const queryStr = req.body?.query || '';
    
    const clinicaUrl = this.configService.get<string>('CLINICA_GRAPHQL_URL') || 'http://localhost:3000/graphql';
    const admUrl = this.configService.get<string>('GESTION_ADMINISTRATIVA_URL') || 'http://localhost:3001/graphql';
    const biUrl = this.configService.get<string>('BI_AUTOMATIZACION_GRAPHQL_URL') || 'http://localhost:8000/graphql/';

    // Obtener la operación raíz real de la query
    const operacionRaiz = this.obtenerNombreOperacion(queryStr);
    this.logger.log(`Operación GraphQL detectada: "${operacionRaiz}"`);

    // Listado de operaciones que pertenecen exclusivamente al módulo administrativo
    const admOperations = [
      // Empleados
      'listarEmpleados', 'verEmpleado', 'buscarEmpleados', 'crearEmpleados', 'editarEmpleado', 'eliminarEmpleado',
      // Turnos
      'listarTurnos', 'verTurno', 'listarTurnosPorEmpleado', 'crearTurnos', 'editarTurno', 'eliminarTurno',
      // Asistencias
      'listarAsistencias', 'verAsistencia', 'listarAsistenciasPorEmpleado', 'crearAsistencias', 'editarAsistencia', 'eliminarAsistencia',
      // Insumos
      'listarInsumos', 'verInsumo', 'listarInsumosConStockBajo', 'crearInsumos', 'editarInsumo', 'eliminarInsumo',
      // Movimientos de Insumos
      'listarMovimientosInsumos', 'verMovimientoInsumo', 'listarMovimientosPorInsumo', 'crearMovimientosInsumos', 'eliminarMovimientoInsumo',
      // Documentos
      'listarDocumentos', 'verDocumento', 'listarDocumentosPorEntidad', 'crearDocumentos', 'editarDocumento', 'eliminarDocumento', 'firmarDocumentoConBlockchain',
      // Facturas
      'listarFacturas', 'listarFacturasEnriquecidas', 'verFactura', 'verFacturaEnriquecida',
      'listarFacturasPorPaciente', 'listarFacturasPorMensualidad',
      'crearFacturas', 'editarFactura', 'anularFactura', 'eliminarFactura',
      'registrarFacturaEnBlockchain', 'generarPdfFactura',
      // Pagos
      'listarPagos', 'verPago', 'listarPagosPorFactura', 'crearPagos', 'editarPago', 'eliminarPago',
      // Tarifas
      'listarTarifas', 'verTarifa', 'actualizarTarifa',
      // Mensualidades
      'listarMensualidades', 'listarMensualidadesEnriquecidas', 'verMensualidad',
      'listarMensualidadesPorPaciente', 'listarMensualidadesPorPlan', 'listarMensualidadesPendientes',
      'crearMensualidades', 'registrarPagoMensualidad',
      // Reportes (BI Administrativo)
      'reporteFinanciero',
      // Empleados extra
      'verEmpleadoPorPersonaId',
      
      // Legacy / Compatibilidad
      'listarSucursales', 'verSucursal', 'crearSucursal', 'editarSucursal', 'eliminarSucursal',
      'listarHorarios', 'verHorario', 'crearHorario', 'editarHorario', 'eliminarHorario',
      'listarNominas', 'verNomina', 'crearNomina', 'editarNomina', 'eliminarNomina',
      'listarInventarios', 'verInventario', 'crearInventario', 'editarInventario', 'eliminarInventario'
    ];

    const biOperations = [
      'predecirTiempoRecuperacion',
      'predecirRiesgoAbandono',
      'dashboardKpis',
      'registrarEvento'
    ];

    // Si la operación raíz pertenece a administración, se enruta allá; de lo contrario va a clínica o BI
    let targetUrl = clinicaUrl;
    if (biOperations.includes(operacionRaiz)) {
      targetUrl = biUrl;
    } else if (admOperations.includes(operacionRaiz)) {
      targetUrl = admUrl;
    }

    this.logger.log(`→ Proxy GraphQL hacia: ${targetUrl}`);

    const headers: Record<string, string> = {
      'content-type': 'application/json',
    };

    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization as string;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(targetUrl, req.body, { headers })
      );
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        // El microservicio respondió con un error HTTP (4xx, 5xx)
        if (error.response) {
          this.logger.error(`← Microservicio respondió ${error.response.status}: ${JSON.stringify(error.response.data)}`);
          return res.status(error.response.status).json(error.response.data);
        }
        // No hubo respuesta: ECONNREFUSED, timeout, DNS, etc.
        this.logger.error(`← No se pudo conectar a ${targetUrl}: ${error.code} — ${error.message}`);
        return res.status(502).json({
          errors: [{ message: `No se pudo conectar al microservicio (${error.code}). ¿Está corriendo en ${targetUrl}?` }]
        });
      }
      // Error inesperado (no es de Axios)
      const mensajeError = error instanceof Error ? error.message : String(error);
      this.logger.error(`← Error inesperado: ${mensajeError}`);
      return res.status(500).json({
        errors: [{ message: `Error interno del gateway: ${mensajeError}` }]
      });
    }
  }
}
