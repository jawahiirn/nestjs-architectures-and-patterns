export class CreateAlarmCommand {
  constructor(
    private readonly name: string,
    private readonly severity: string,
  ) {}
}
