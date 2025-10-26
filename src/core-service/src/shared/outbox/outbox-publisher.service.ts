import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OutboxService } from './outbox.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OutboxPublisherService implements OnModuleInit {
  private readonly logger = new Logger(OutboxPublisherService.name);
  private isProcessing = false;

  constructor(
    private readonly outboxService: OutboxService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    this.logger.log('Starting Outbox Publisher Service');
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    if (this.isProcessing) {
      this.logger.warn('Outbox Publisher Service is already processing');
      return;
    }
    this.isProcessing = true;

    try {
      const events = await this.outboxService.getUnprocessedEvents(100);

      this.logger.debug(`Fetched ${events.length} unprocessed outbox events`);

      for (const event of events) {
        try {
          this.eventEmitter.emit(event.eventType, event.payload);
          await this.outboxService.markEventAsProcessed(event.id);
        } catch (error) {
          this.logger.error(
            `Error emitting event ${event.eventType}`,
            error.stack,
          );
          await this.outboxService.markEventAsFailed(event.id);
        }
      }
    } catch (error) {
      this.logger.error('Error processing outbox events', error.stack);
    } finally {
      this.isProcessing = false;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupProcessedEvents() {
    this.logger.log('Cleaning up processed outbox events older than 7 days');
    const hourAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await this.outboxService.cleanupProcessedEvents(hourAgo);
  }
}
