import { Injectable } from '@nestjs/common';
import { AlarmSeverity } from '../value-objects/alarm-severity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AlarmFactory {
  create(name: string, severity: AlarmSeverity['value']) {
    const alarmId = randomUUID();
    const alarmSeverity = new AlarmSeverity(severity);
  }
}
