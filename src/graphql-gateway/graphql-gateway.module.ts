import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { GuardsAutenticacion } from '../guards/guard-autenticacion';
import { GuardPermisos } from '../guards/guard-permisos';
import { GraphqlGatewayController } from './graphql-gateway.controller';

@Module({
  imports: [
    HttpModule.register({ timeout: 30000 }),
    ConfigModule,
    AuthModule,
  ],
  controllers: [GraphqlGatewayController],
  providers: [GuardsAutenticacion, GuardPermisos],
})
export class GraphqlGatewayModule {}
