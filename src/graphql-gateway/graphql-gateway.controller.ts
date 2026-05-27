import { Controller, Req, Res, All } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Controller('graphql')
export class GraphqlGatewayController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Recibe todas las peticiones GraphQL dirigidas a la puerta de enlace,
   * y las enruta dinámicamente al microservicio correspondiente.
   */
  @All()
  async handleGraphql(@Req() req: Request, @Res() res: Response) {
    const queryStr = req.body?.query || '';
    
    const clinicaUrl = this.configService.get<string>('CLINICA_GRAPHQL_URL') || 'http://localhost:3000/graphql';
    const admUrl = this.configService.get<string>('GESTION_ADMINISTRATIVA_URL') || 'http://localhost:3001/graphql';

    // Determinar destino buscando palabras clave de gestión administrativa en el query
    const admKeywords = [
      'empleado', 'sucursal', 'horario', 'nomina', 'inventario', 'pago', 'factura',
      'listarEmpleados', 'verEmpleado', 'crearEmpleado', 'editarEmpleado', 'eliminarEmpleado',
      'listarSucursales', 'verSucursal', 'crearSucursal', 'editarSucursal', 'eliminarSucursal',
      'listarHorarios', 'verHorario', 'crearHorario', 'editarHorario', 'eliminarHorario',
      'listarNominas', 'verNomina', 'crearNomina', 'editarNomina', 'eliminarNomina',
      'listarInventarios', 'verInventario', 'crearInventario', 'editarInventario', 'eliminarInventario',
      'listarPagos', 'verPago', 'crearPago', 'editarPago', 'eliminarPago',
      'listarFacturas', 'verFactura', 'crearFactura', 'editarFactura', 'eliminarFactura'
    ];

    const isAdministrative = admKeywords.some(keyword => queryStr.includes(keyword));
    const targetUrl = isAdministrative ? admUrl : clinicaUrl;

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
      if (error instanceof AxiosError && error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json({
        errors: [{ message: `Error al comunicar con el microservicio: ${error?.message || 'Error desconocido'}` }]
      });
    }
  }
}
