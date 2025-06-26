import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ClaimsExtractorModule } from './claims-extractor/claims-extractor.module';
import configuration from './config/configuration';
import { ClaimExtract } from './entities/claim-extract.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        url: `mysql://${config.get('database.username')}:${config.get('database.password')}@${config.get('database.host')}:${config.get('database.port')}/${config.get('database.database')}`,
        entities: [ClaimExtract],
        synchronize: true,
        retryAttempts: 10,
        retryDelay: 3000,
        autoLoadEntities: true,
        connectTimeout: 30000,
        acquireTimeout: 30000,
        timeout: 30000,
        extra: {
          connectionLimit: 10,
          acquireTimeout: 30000,
          timeout: 30000,
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ([{
        ttl: config.get<number>('THROTTLE_TTL', 60) * 1000,
        limit: config.get<number>('THROTTLE_LIMIT', 10),
      }]),
    }),
    ClaimsExtractorModule,
  ],
})
export class AppModule {}
