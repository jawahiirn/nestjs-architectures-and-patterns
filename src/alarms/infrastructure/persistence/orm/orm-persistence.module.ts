import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmEntity } from './entities/alarm.entity';
import { CreateAlarmRepository } from '../../../application/ports/create-alarm.repository';
import { OrmCreateAlarmRepository } from './repositories/create-alarm.repository';
import { AlarmItemEntity } from './entities/alarm-item.entity';
import { FindAlarmsRepository } from '../../../application/ports/find-alarms.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AlarmEntity, AlarmItemEntity])],
  providers: [
    OrmCreateAlarmRepository,
    {
      provide: CreateAlarmRepository,
      useExisting: OrmCreateAlarmRepository,
    },
    {
      provide: FindAlarmsRepository,
      useExisting: OrmCreateAlarmRepository,
    },
  ],
  exports: [CreateAlarmRepository, FindAlarmsRepository],
})
export class OrmAlarmPersistenceModule {}
