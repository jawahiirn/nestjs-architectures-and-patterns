import { Alarm } from '../alarms';

export class AlarmCreatedEvent {
  constructor(public readonly alarm: Alarm) {}
}
