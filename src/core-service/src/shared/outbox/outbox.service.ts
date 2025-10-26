import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma';
import OutboxEventDto from './outbox-event.dto';

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async publishEvent(event: OutboxEventDto, tx?: PrismaService) {
    const client = tx ?? this.prismaService;

    this.logger.debug(
      `Publishing outbox event: ${event.eventType} for aggregate ID: ${event.aggregateId}`,
    );

    return client.outbox.create({
      data: {
        aggregateId: event.aggregateId,
        eventType: event.eventType,
        payload: event.payload,
      },
    });
  }

  async getUnprocessedEvents(limit = 100) {
    return this.prismaService.outbox.findMany({
      where: { processedAt: null, attempts: { lt: 3 } },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async bulkMarkEventsAsProcessed(eventIds: string[]) {
    this.logger.debug(`Marking ${eventIds.length} outbox events as processed`);

    return this.prismaService.outbox.updateMany({
      where: { id: { in: eventIds } },
      data: { processedAt: new Date() },
    });
  }

  async bulkMarkEventsAsFailed(eventIds: string[]) {
    this.logger.debug(`Marking ${eventIds.length} outbox events as failed`);

    return this.prismaService.outbox.updateMany({
      where: { id: { in: eventIds } },
      data: { failedAt: new Date(), attempts: { increment: 1 } },
    });
  }

  async cleanupProcessedEvents(olderThan: Date) {
    this.logger.log(
      `Cleaning up processed outbox events older than ${olderThan.toISOString()}`,
    );

    return this.prismaService.outbox.deleteMany({
      where: { processedAt: { not: null, lt: olderThan } },
    });
  }
}
