export default interface OutboxEventDto {
  aggregateId: string;
  eventType: string;
  payload: Record<string, any>;
}
