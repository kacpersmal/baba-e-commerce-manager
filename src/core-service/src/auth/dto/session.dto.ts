import { ApiProperty } from '@nestjs/swagger';

export class SessionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  lastUsedAt: Date;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty({ required: false })
  userAgent?: string;

  @ApiProperty({ required: false })
  ipAddress?: string;

  @ApiProperty()
  isCurrentSession: boolean;
}

export class GetSessionsDto {
  @ApiProperty({ type: [SessionDto] })
  sessions: SessionDto[];
}
