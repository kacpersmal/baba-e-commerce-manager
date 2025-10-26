import { Module } from '@nestjs/common';
import { OutboxService } from './outbox.service';
import { OutboxPublisherService } from './outbox-publisher.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitter } from 'stream';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [ScheduleModule.forRoot(), EventEmitterModule.forRoot()],
  providers: [OutboxService, OutboxPublisherService],
  exports: [OutboxService],
})
export class OutboxModule {}
