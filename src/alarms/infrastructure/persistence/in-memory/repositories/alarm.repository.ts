import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../../../../application/ports/alarm.repository';
import { AlarmEntity } from '../entities/alarm.entity';
import { Alarm } from '../../../../domain/alarm';
import { AlarmMapper } from '../mappers/alarm.mapper';

@Injectable()
export class InMemoryAlarmRepository implements AlarmRepository {
  private readonly alarms = new Map<string, AlarmEntity>();

  findAll(): Alarm[] {
    const entities = Array.from(this.alarms.values());
    return entities.map((item) => AlarmMapper.toDomain(item));
  }
  save(alarm: Alarm): Alarm {
    const persistenceModel = AlarmMapper.toPersistence(alarm);
    this.alarms.set(persistenceModel.id, persistenceModel);

    const newEntity = this.alarms.get(persistenceModel.id);
    return AlarmMapper.toDomain(newEntity as AlarmEntity);
  }
}
