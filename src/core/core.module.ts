import { Module } from '@nestjs/common';
import { ApplicationBootstrapOptions } from '../common/interfaces/application-bootstrap-options.interface';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({})
export class CoreModule {
  static forRoot(options: ApplicationBootstrapOptions) {
    const imports =
      options.driver === 'orm'
        ? [
            TypeOrmModule.forRoot({
              type: 'postgres',
              host: process.env.DATABASE_HOST,
              port: parseInt(process.env.DATABASE_PORT || '5432', 10),
              password: process.env.DATABASE_PASSWORD,
              username: process.env.DATABASE_USER,
              database: process.env.DATABASE_NAME,
              autoLoadEntities: true,
              synchronize: true,
            }),
          ]
        : [];
    return {
      module: CoreModule,
      imports,
    };
  }
}
