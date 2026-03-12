import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AlarmCreatedEvent } from '../../domain/events/alarm-created.event';
import { Logger } from '@nestjs/common';
import { UpsertMaterializedAlarmRepository } from '../ports/upsert-materialized-alarm.repository';
import { SerializableEventPayload } from '../../../shared/domain/interfaces/serializable-event';

@EventsHandler(AlarmCreatedEvent)
export class AlarmCreatedEventHandler implements IEventHandler<
  SerializableEventPayload<AlarmCreatedEvent>
> {
  private readonly logger = new Logger(AlarmCreatedEvent.name);

  constructor(
    private readonly upsertMaterializedAlarmRepository: UpsertMaterializedAlarmRepository,
  ) {}

  async handle(
    event: SerializableEventPayload<AlarmCreatedEvent>,
  ): Promise<void> {
    this.logger.log(`Alarm created event: ${JSON.stringify(event)}`);
    // In a real-world app, we would have to ensure that this operation is atomic,
    // with th creation of the alarm. Otherwise, we could end up with an alarm that is created in the read model.
    // because the DB operations fails. For info: "Transactional inbox/outbox pattern"
    await this.upsertMaterializedAlarmRepository.upsert({
      id: event.alarm.id,
      name: event.alarm.name,
      severity: event.alarm.severity,
      triggeredAt: new Date(event.alarm.triggeredAt),
      isAcknowledged: event.alarm.isAcknowledged,
      items: event.alarm.items,
    });
  }
}
