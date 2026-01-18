import { AlarmEntity } from '../entities/alarm.entity';
import { AlarmSeverity } from '../../../../domain/value-objects/alarm-severity';
import { Alarm } from '../../../../domain/alarms';

type severityType = 'critical' | 'high' | 'medium' | 'low';

export class AlarmMapper {
  static toDomain(alarmEntity: AlarmEntity) {
    const alarmSeverity = new AlarmSeverity(
      alarmEntity.severity as severityType,
    );
    return new Alarm(alarmEntity.id, alarmEntity.name, alarmSeverity);
  }

  static toPersistence(alarm: Alarm) {
    const entity = new AlarmEntity();
    entity.id = alarm.id;
    entity.name = alarm.name;
    entity.severity = alarm.severity.value;
    return entity;
  }
}
