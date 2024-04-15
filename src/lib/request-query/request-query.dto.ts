import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { isArray, IsArray, IsObject, IsOptional, Min } from 'class-validator';
import { SortOrder } from 'mongoose';

export type SortableParameters = {
  [key: string]: SortOrder;
};

export type FilterableParameters = Record<string, unknown>;

export class RequestQueryDto {
  @ApiPropertyOptional({
    description: 'Filter query string (JSON), see documentation for its schema',
    required: false,
    type: String,
  })
  @Transform((v: TransformFnParams) => filterQueryToObject(v.value))
  @IsObject()
  filter: FilterableParameters = {};
  @Type(() => Number)
  @Min(1)
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    required: false,
  })
  page: number = 1;
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  pageSize: number = 10;
  @ApiPropertyOptional({
    description: 'Fields to populate',
    required: false,
    type: [String],
    example: [''],
    default: [],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value && !isArray(value)) {
      return [value];
    }
    if (!value) {
      return [];
    }
    return value;
  })
  @IsArray()
  populate?: string[] = [];
  @ApiPropertyOptional({
    description: 'Fields to select',
    required: false,
    type: [String],
    example: [''],
    default: [],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value && !isArray(value)) {
      return [value];
    }
    if (!value) {
      return [];
    }
    return value;
  })
  @IsArray()
  select?: string[] = [];
  @ApiPropertyOptional({
    description:
      'Only whitelisted properties separated by semicolon; prefix with -/+ for DESC/ASC order',
    example: {
      createdAt: 'desc',
    },
    default: {
      createdAt: 'desc',
    },
    required: false,
    type: String,
  })
  @IsOptional()
  @Transform((v: TransformFnParams) => filterQueryToObject(v.value))
  @IsObject()
  sort?: SortableParameters;
}

function filterQueryToObject(v: string): Record<string, unknown> {
  if (!v) return {};
  return JSON.parse(v);
}
