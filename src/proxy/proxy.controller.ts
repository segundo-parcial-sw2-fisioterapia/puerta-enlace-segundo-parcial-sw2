import { Controller, All, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Controller('bi-automatizacion')
export class ProxyController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Enruta dinámicamente cualquier petición REST dirigida a /api/bi-automatizacion/*
   * hacia el microservicio correspondiente (bi-automatizacion-segundo-parcial-sw2).
   */
  @All('*')
  async proxyBi(@Req() req: Request, @Res() res: Response) {
    const biUrl = this.configService.get<string>('BI_AUTOMATIZACION_URL') || 'http://localhost:8000/api';
    
    const subRoute = req.params[0] || '';
    const targetUrl = `${biUrl}/${subRoute}`;

    const headers: Record<string, string> = {
      'content-type': 'application/json',
    };

    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization as string;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method as any,
          url: targetUrl,
          data: req.body,
          headers,
          params: req.query,
        })
      );
      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json({
        statusCode: 500,
        message: `Error al comunicar con bi-automatizacion: ${error?.message || 'Error desconocido'}`
      });
    }
  }
}
