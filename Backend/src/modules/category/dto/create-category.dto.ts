import { IsString, IsOptional, IsInt, IsNotEmpty, IsPositive, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  picture?: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  parentId?: number;
}
