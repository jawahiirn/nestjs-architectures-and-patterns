import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmEntity } from './entities/alarm.entity';
import { CreateAlarmRepository } from '../../../application/ports/create-alarm.repository';
import { OrmAlarmRepository } from './repositories/alarm.repository';
import { AlarmItemEntity } from './entities/alarm-item.entity';
import { FindAlarmsRepository } from '../../../application/ports/find-alarms.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AlarmEntity, AlarmItemEntity])],
  providers: [
    OrmAlarmRepository,
    {
      provide: CreateAlarmRepository,
      useExisting: OrmAlarmRepository,
    },
    {
      provide: FindAlarmsRepository,
      useExisting: OrmAlarmRepository,
    },
  ],
  exports: [CreateAlarmRepository, FindAlarmsRepository],
})
export class OrmAlarmPersistenceModule { }
