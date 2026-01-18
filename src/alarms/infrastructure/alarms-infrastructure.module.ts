import { Module } from '@nestjs/common';
import { OrmAlarmPersistenceModule } from './persistence/orm/orm-persistence.module';
import { InMemoryPersistenceModule } from './persistence/in-memory/in-memory-persistence.module';

@Module({})
export class InfrastructureModule {
  static use(driver: 'orm' | 'in-memory') {
    const persistenceModule =
      driver === 'orm' ? OrmAlarmPersistenceModule : InMemoryPersistenceModule;
    return {
      module: InfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
