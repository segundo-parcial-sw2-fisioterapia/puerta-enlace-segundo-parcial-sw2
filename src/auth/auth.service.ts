import {
  Injectable,
  UnauthorizedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface UsuarioClinica {
  id: number | string;
  correo: string;
  roles: string[];
  estado: string;
  fecha_creacion: string;
  ultimo_acceso: string;
  persona: {
    id: number | string;
    nombre: string;
    apellido: string;
    ci: string;
    telefono: string;
  } | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtServicio: JwtService,
    private readonly httpServicio: HttpService,
    private readonly configuracionServicio: ConfigService,
  ) {}

  /**
   * Consulta credenciales al microservicio clinica vía REST.
   * Devuelve los datos del usuario sin contrasena_hash.
   */
  async validarCredenciales(
    correo: string,
    contrasena: string,
  ): Promise<UsuarioClinica> {
    const urlClinica = this.configuracionServicio.get<string>('CLINICA_URL');
    try {
      const { data } = await firstValueFrom(
        this.httpServicio.post<UsuarioClinica & { contrasena_hash?: string }>(
          `${urlClinica}/auth/login`,
          { correo, contrasena },
        ),
      );
      const { contrasena_hash: _hashDescartado, ...usuarioSaneado } = data;
      void _hashDescartado;
      return usuarioSaneado;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const codigoHttp = error.response.status;
        if (codigoHttp === 401 || codigoHttp === 404) {
          throw new UnauthorizedException('Credenciales inválidas');
        }
      }
      throw new ServiceUnavailableException(
        'El servicio de autenticación no está disponible',
      );
    }
  }

  /**
   * Emite un par de tokens (acceso + refresco) para el usuario validado.
   */
  emitirToken(usuario: UsuarioClinica): {
    tokenAcceso: string;
    tokenRefresco: string;
  } {
    const payloadAcceso = {
      sub: usuario.id,
      correo: usuario.correo,
      roles: usuario.roles,
      persona: usuario.persona
        ? {
            id: usuario.persona.id,
            nombre: usuario.persona.nombre,
            apellido: usuario.persona.apellido,
          }
        : null,
    };

    const payloadRefresco = {
      sub: usuario.id,
      tipo: 'refresh',
    };

    const tokenAcceso: string = this.jwtServicio.sign(payloadAcceso, {
      expiresIn: (this.configuracionServicio.get<string>('JWT_EXPIRATION') ??
        '1h') as any,
    });

    const tokenRefresco: string = this.jwtServicio.sign(payloadRefresco, {
      expiresIn: (this.configuracionServicio.get<string>(
        'JWT_REFRESH_EXPIRATION',
      ) ?? '7d') as any,
    });

    return { tokenAcceso, tokenRefresco };
  }

  /**
   * Verifica un token de refresco y emite un nuevo token de acceso.
   */
  renovarToken(tokenRefresco: string): { tokenAcceso: string } {
    let payload: { sub: string; tipo: string };
    try {
      payload = this.jwtServicio.verify<{ sub: string; tipo: string }>(
        tokenRefresco,
      );
    } catch {
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }

    if (payload.tipo !== 'refresh') {
      throw new UnauthorizedException('Token de refresco inválido');
    }

    const tokenAcceso: string = this.jwtServicio.sign(
      { sub: payload.sub },
      {
        expiresIn: (this.configuracionServicio.get<string>('JWT_EXPIRATION') ??
          '1h') as any,
      },
    );

    return { tokenAcceso };
  }

  /**
   * Cierra la sesión del usuario. Stateless: el frontend descarta los tokens.
   */
  cerrarSesion(): { mensaje: string } {
    return { mensaje: 'Sesión cerrada correctamente' };
  }
}
