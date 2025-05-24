import { IsString, IsOptional, IsInt, IsPositive, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  picture?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  parentId?: number;
}
