import { Injectable } from '@nestjs/common';
import { CreateAlarmRepository } from '../../../../application/ports/create-alarm.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmEntity } from '../entities/alarm.entity';
import { Repository } from 'typeorm';
import { Alarm } from '../../../../domain/alarm';
import { AlarmMapper } from '../mappers/alarm.mapper';

@Injectable()
export class OrmCreateAlarmRepository implements CreateAlarmRepository {
  constructor(
    @InjectRepository(AlarmEntity)
    private readonly alarmRepository: Repository<AlarmEntity>,
  ) {}

  async save(alarm: Alarm): Promise<Alarm> {
    const persistenceModel = AlarmMapper.toPersistence(alarm);
    const newEntity = await this.alarmRepository.save(persistenceModel);
    return AlarmMapper.toDomain(newEntity);
  }
}
