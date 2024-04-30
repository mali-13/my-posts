import { IsNumber, IsOptional, Min } from 'class-validator';

export class PageOptionDto {
  /**
   * The page number for pagination (optional, defaults to 1).
   * @example 1
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  /**
   * The limit of items per page (optional, defaults to 10).
   * @example 10
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
