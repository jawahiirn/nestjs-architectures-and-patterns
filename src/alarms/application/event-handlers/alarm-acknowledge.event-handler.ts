import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AlarmCreatedEvent } from '../../domain/events/alarm-created.event';
import { Logger } from '@nestjs/common';
import { UpsertMaterializedAlarmRepository } from '../ports/upsert-materialized-alarm.repository';
import { SerializableEventPayload } from '../../../shared/domain/interfaces/serializable-event';
import { AlarmAcknowledgedEvent } from '../../domain/events/alarm-acknowledged.event';

@EventsHandler(AlarmAcknowledgedEvent)
export class AlarmAcknowledgedEventHandler implements IEventHandler<
  SerializableEventPayload<AlarmAcknowledgedEvent>
> {
  private readonly logger = new Logger(AlarmAcknowledgedEvent.name);

  constructor(
    private readonly upsertMaterializedAlarmRepository: UpsertMaterializedAlarmRepository,
  ) {}

  async handle(
    event: SerializableEventPayload<AlarmAcknowledgedEvent>,
  ): Promise<void> {
    // In a real world application, we would have to ensure that this event is
    // redelivered in case of a failure. Otherise, we would end up with an inconsistent state.
    this.logger.log(`Alarm acknowledged event: ${JSON.stringify(event)}`);
    await this.upsertMaterializedAlarmRepository.upsert({
      id: event.alarmId,
      isAcknowledged: true,
    });
  }
}
