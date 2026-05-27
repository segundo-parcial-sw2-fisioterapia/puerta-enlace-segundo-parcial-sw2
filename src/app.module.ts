import { Module } from '@nestjs/common';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { AuthModule } from './auth/auth.module';
import { ProxyModule } from './proxy/proxy.module';
import { GraphqlGatewayModule } from './graphql-gateway/graphql-gateway.module';

@Module({
  imports: [ConfiguracionModule, AuthModule, ProxyModule, GraphqlGatewayModule],
})
export class AppModule {}
