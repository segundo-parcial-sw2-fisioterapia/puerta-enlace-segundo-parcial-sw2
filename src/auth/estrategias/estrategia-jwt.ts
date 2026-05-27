import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface PayloadJwt {
  sub: string;
  correo: string;
  roles: string[];
  persona: { id: string; nombre: string; apellido: string };
}

@Injectable()
export class EstrategiasJwt extends PassportStrategy(Strategy) {
  constructor(private readonly configuracionServicio: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuracionServicio.get<string>('JWT_SECRET') ?? '',
    });
  }

  /**
   * Valida el payload del JWT extraído por passport-jwt.
   * El objeto devuelto queda disponible en request.user.
   */
  validate(payload: PayloadJwt) {
    return {
      id: payload.sub,
      correo: payload.correo,
      roles: payload.roles,
      persona: payload.persona,
    };
  }
}
