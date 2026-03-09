import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './event-store/schema/event.schema';
import { EVENT_STORE_CONNECTION } from '../../core/core.constants';
import { EventSerializer } from './event-store/serializers/event.serializer';
import { EventStorePublisher } from './event-store/publishers/publisher';
import { MongoEventStore } from './event-store/mongo-event.store';
import { EventsBridge } from './event-store/event-bridge';
import { EventDeserializer } from './event-store/deserializers/event.deserializer';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Event.name, schema: EventSchema }],
      EVENT_STORE_CONNECTION,
    ),
  ],
  providers: [
    EventSerializer,
    EventStorePublisher,
    MongoEventStore,
    EventsBridge,
    EventDeserializer,
  ],
})
export class SharedInfrastructureModule {}
