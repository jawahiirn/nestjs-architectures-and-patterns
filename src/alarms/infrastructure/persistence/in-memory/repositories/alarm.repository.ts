import { Injectable } from '@nestjs/common';
import { CreateAlarmRepository } from '../../../../application/ports/create-alarm.repository';
import { AlarmEntity } from '../entities/alarm.entity';
import { Alarm } from '../../../../domain/alarm';
import { AlarmMapper } from '../mappers/alarm.mapper';
import { FindAlarmsRepository } from '../../../../application/ports/find-alarms.repository';
import { UpsertMaterializedAlarmRepository } from '../../../../application/ports/upsert-materialized-alarm.repository';
import { AlarmReadModel } from '../../../../domain/read-models/alarm.read-model';

@Injectable()
export class InMemoryAlarmRepository
  implements
    CreateAlarmRepository,
    FindAlarmsRepository,
    UpsertMaterializedAlarmRepository
{
  private readonly alarms = new Map<string, AlarmEntity>();
  private readonly materializedAlarmsViews = new Map<string, AlarmReadModel>();

  findAll(): AlarmReadModel[] {
    return Array.from(this.materializedAlarmsViews.values());
  }
  save(alarm: Alarm): Alarm {
    const persistenceModel = AlarmMapper.toPersistence(alarm);
    this.alarms.set(persistenceModel.id, persistenceModel);

    const newEntity = this.alarms.get(persistenceModel.id);
    return AlarmMapper.toDomain(newEntity as AlarmEntity);
  }

  upsert(alarm: Pick<AlarmReadModel, 'id'> & Partial<AlarmReadModel>): void {
    const existingAlarm = this.materializedAlarmsViews.get(alarm.id);

    if (existingAlarm) {
      this.materializedAlarmsViews.set(alarm.id, {
        ...existingAlarm,
        ...alarm,
      } as AlarmReadModel);
    }
    this.materializedAlarmsViews.set(alarm.id, alarm as AlarmReadModel);
  }
}
