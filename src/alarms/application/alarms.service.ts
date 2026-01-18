import { Injectable } from '@nestjs/common';
import { CreateAlarmCommand } from './commands/create-alarm.command';
import { AlarmRepository } from './ports/alarm.repository';
import { AlarmFactory } from '../domain/factories/alarm.factory';

@Injectable()
export class AlarmsService {
  constructor(
    private readonly alarmsRepository: AlarmRepository,
    private readonly alarmFactory: AlarmFactory,
  ) {}

  create(createAlarmCommand: CreateAlarmCommand) {
    const alarm = this.alarmFactory.create(
      createAlarmCommand.name,
      createAlarmCommand.severity as 'critical' | 'high' | 'medium' | 'low',
    );
    return this.alarmsRepository.save(alarm);
  }

  findAll() {
    return this.alarmsRepository.findAll();
  }
}
