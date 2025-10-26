import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { OutboxService } from './outbox.service';

class TestEventDto {
  @ApiProperty({
    description: 'Test message to include in the event',
    example: 'Hello from outbox test',
  })
  @IsString()
  message: string;
}

@Controller('outbox')
@ApiTags('outbox')
export class OutboxController {
  constructor(private readonly outboxService: OutboxService) {}

  @Post('test-event')
  @ApiOperation({ summary: 'Add a test event to outbox (for testing)' })
  @ApiResponse({ status: 201, description: 'Event added to outbox' })
  async addTestEvent(@Body() data: TestEventDto) {
    const event = await this.outboxService.publishEvent({
      aggregateId: `test-${Date.now()}`,
      eventType: 'test.event.created',
      payload: {
        message: data?.message || 'Test event from API',
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      eventId: event.id,
      message: 'Event added to outbox and will be published shortly',
    };
  }
}
