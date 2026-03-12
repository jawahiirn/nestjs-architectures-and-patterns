import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { bufferTime, filter, groupBy, map, mergeMap, Observable } from 'rxjs';
import { AlarmCreatedEvent } from '../../domain/events/alarm-created.event';
import { NotifyFacilitySupervisorCommand } from '../commands/notify-facility-supervisor.command';

@Injectable()
export class CascadingAlarmsSaga {
  private readonly logger = new Logger(CascadingAlarmsSaga.name);

  @Saga()
  start = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(AlarmCreatedEvent),
      // Instead of grouping events by alarm name, we could group them by facilityId
      groupBy((event) => event.alarm.name),
      mergeMap((groupEvents) =>
        // Buffer events for 5 seconds or until 3 events are received
        groupEvents.pipe(bufferTime(5000, undefined, 3)),
      ),
      filter((events) => events.length > 2),
      map((events) => {
        this.logger.debug('^^^ Warning, 3 alarms in 5 seconds');
        const facilityId = '12345'; // Replace with facility id
        return new NotifyFacilitySupervisorCommand(
          facilityId,
          events.map((event) => event.alarm.id),
        );
      }),
    );
  };
}
