import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Elektronika' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'URL-friendly slug', example: 'electronics' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    description: 'Icon name from lucide-react',
    example: 'Smartphone',
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Tailwind color class',
    example: 'text-blue-500',
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ description: 'Display order', example: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Parent category ID for subcategories' })
  @IsString()
  @IsOptional()
  parentId?: string;
}
