import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import {
  EMPTY,
  filter,
  first,
  map,
  mergeMap,
  Observable,
  race,
  timer,
} from 'rxjs';
import { AlarmCreatedEvent } from '../../domain/events/alarm-created.event';
import { AlarmAcknowledgedEvent } from '../../domain/events/alarm-acknowledged.event';
import { NotifyFacilitySupervisorCommand } from '../commands/notify-facility-supervisor.command';

@Injectable()
export class UnacknowledgedAlarmsSaga {
  private readonly logger = new Logger(UnacknowledgedAlarmsSaga.name);

  @Saga()
  start = (events$: Observable<any>): Observable<ICommand> => {
    const alarmAcknowledgeEvents$ = events$.pipe(
      ofType(AlarmAcknowledgedEvent),
    );
    const alarmCreatedEvents$ = events$.pipe(ofType(AlarmCreatedEvent));

    return alarmCreatedEvents$.pipe(
      mergeMap((alarmCreatedEvent) =>
        race(
          alarmAcknowledgeEvents$.pipe(
            filter(
              (alarmAcknowledgedEvent) =>
                alarmAcknowledgedEvent.alarmId === alarmCreatedEvent.alarm.id,
            ),
            first(),
            // If the alarm is acknowledged, we don't need to do anything
            // Just return an empty observable that never emits
            mergeMap(() => EMPTY),
          ),
          timer(15000).pipe(map(() => alarmCreatedEvent)),
        ),
      ),
      map((alarmCreatedEvent) => {
        this.logger.debug(
          `^^^ Alarm "${alarmCreatedEvent.alarm.name}" not acknowledged within 15 seconds`,
        );
        const facilityId = '12345';
        return new NotifyFacilitySupervisorCommand(facilityId, [
          alarmCreatedEvent.alarm.id,
        ]);
      }),
    );
  };
}
