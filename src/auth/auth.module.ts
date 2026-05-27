import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EstrategiasJwt } from './estrategias/estrategia-jwt';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configuracionServicio: ConfigService) => ({
        secret: configuracionServicio.get<string>('JWT_SECRET') ?? '',
        signOptions: {
          expiresIn: (configuracionServicio.get<string>('JWT_EXPIRATION') ??
            '1h') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EstrategiasJwt],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
