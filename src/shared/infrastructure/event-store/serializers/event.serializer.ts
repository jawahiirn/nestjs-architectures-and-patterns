import { Injectable } from '@nestjs/common';
import { VersionedAggregateRoot } from '../../../domain/aggregate-root';
import { SerializableEvent } from '../../../domain/interfaces/serializable-event';

@Injectable()
export class EventSerializer {
  serialize<T>(
    event: T,
    dispatcher: VersionedAggregateRoot,
  ): SerializableEvent<T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const eventType = (event as any).constructor?.name as string;

    if (!eventType) {
      throw new Error('Incomplete event type');
    }

    const aggregateRootId = dispatcher.id;

    return {
      streamId: aggregateRootId,
      position: dispatcher.version.value + 1,
      type: eventType,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: this.toJSON(event),
    };
  }

  private toJSON<T>(data: T): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if ('toJSON' in data && typeof (data as any).toJSON === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      return (data as any).toJSON();
    }

    if (Array.isArray(data)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data.map((item) => this.toJSON(item));
    }

    const result: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        result[key] = this.toJSON((data as any)[key]);
      }
    }
    return result;
  }
}
