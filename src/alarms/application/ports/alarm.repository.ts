import { Alarm } from '../../domain/alarms';

export abstract class AlarmRepository {
  abstract findAll(): Promise<Alarm[]> | Alarm[];
  abstract save(alarm: Alarm): Promise<Alarm> | Alarm;
}
