import { Injectable } from '@nestjs/common';
import { AlarmSeverity } from '../value-objects/alarm-severity';
import { randomUUID } from 'node:crypto';
import { Alarm } from '../alarms';

@Injectable()
export class AlarmFactory {
  create(name: string, severity: AlarmSeverity['value']) {
    const alarmId = randomUUID();
    const alarmSeverity = new AlarmSeverity(severity);
    return new Alarm(alarmId, name, alarmSeverity);
  }
}
