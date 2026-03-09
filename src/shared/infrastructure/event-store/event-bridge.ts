import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  Logger,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EVENT_STORE_CONNECTION } from '../../../core/core.constants';
import { Event, EventDocument } from './schema/event.schema';
import { EventDeserializer } from './deserializers/event.deserializer';
import { ChangeStream, ChangeStreamInsertDocument } from 'mongodb';

@Injectable()
export class EventsBridge
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(EventsBridge.name);
  private changeStream: ChangeStream;

  constructor(
    @InjectModel(Event.name, EVENT_STORE_CONNECTION)
    private readonly eventStore: Model<Event>,
    private readonly eventBus: EventBus,
    private readonly eventDeserializer: EventDeserializer,
  ) {}

  onApplicationBootstrap() {
    this.changeStream = this.eventStore
      .watch()
      .on('change', (change: ChangeStreamInsertDocument<EventDocument>) => {
        if (change.operationType === 'insert') {
          this.handleEventStoreChange(change);
        }
      })
      .on('error', (error) => {
        this.logger.error(`Change stream encountered an error: ${error.stack}`);
      });
  }

  onApplicationShutdown() {
    return this.changeStream.close();
  }

  handleEventStoreChange(change: ChangeStreamInsertDocument<EventDocument>) {
    try {
      const insertedEvent = change.fullDocument;
      const eventInstance = this.eventDeserializer.deserialize(insertedEvent);
      this.eventBus.subject$.next(eventInstance.data as any);
    } catch (error) {
      this.logger.error(`Error handling event store change: ${error.stack}`);
    }
  }
}
