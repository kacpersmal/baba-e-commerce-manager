import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({ example: 'Magazyn Centralny Warszawa' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'WH-WAW-01',
    description: 'Unique warehouse code',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9-]+$/, {
    message: 'Code must contain only uppercase letters, numbers, and hyphens',
  })
  code: string;

  @ApiPropertyOptional({
    example: 'Primary distribution center for North East region',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 52.2297, description: 'Latitude (-90 to 90)' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 21.0122, description: 'Longitude (-180 to 180)' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ example: 'ul. Magazynowa 42' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Warszawa' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ example: 'Mazowieckie' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'Polska' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '00-001' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ example: 'Jan Kowalski' })
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @ApiProperty({ example: 'warehouse.waw@example.pl' })
  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @ApiProperty({ example: '+48 22 123 4567' })
  @IsString()
  @IsNotEmpty()
  contactPhone: string;
}
