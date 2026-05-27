import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ProxyController } from './proxy.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ProxyController],
})
export class ProxyModule {}
