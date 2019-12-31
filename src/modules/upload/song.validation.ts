import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VSong {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  uploadedBy: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  imageUrl: string;
}
