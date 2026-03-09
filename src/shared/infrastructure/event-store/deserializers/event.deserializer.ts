import { Injectable, Type, UnauthorizedException } from '@nestjs/common';
import { SerializableEvent } from '../../../domain/interfaces/serializable-event';
import { Event } from '../schema/event.schema';
import { AlarmCreatedEvent } from '../../../../alarms/domain/events/alarm-created.event';

@Injectable()
export class EventDeserializer {
  deserialize<T>(event: Event): SerializableEvent<T> {
    const eventCls = this.getEventClassByType(event.type);
    if (!eventCls) throw new UnauthorizedException('Unknown event type');
    return {
      ...event,
      data: this.instantiateSerializedEvent(eventCls, event.data),
    };
  }

  getEventClassByType(type: string) {
    switch (type) {
      case AlarmCreatedEvent.name:
        return AlarmCreatedEvent;
    }
  }

  instantiateSerializedEvent<T extends Type>(
    eventCls: T,
    data: Record<string, any>,
  ) {
    return Object.assign(Object.create(eventCls.prototype), data);
  }
}
