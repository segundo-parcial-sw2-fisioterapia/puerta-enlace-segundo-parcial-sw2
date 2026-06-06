import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { GuardsAutenticacion } from '../guards/guard-autenticacion';
import { GuardPermisos } from '../guards/guard-permisos';
import { ProxyController } from './proxy.controller';

@Module({
  imports: [HttpModule, ConfigModule, AuthModule],
  controllers: [ProxyController],
  providers: [GuardsAutenticacion, GuardPermisos],
})
export class ProxyModule {}
