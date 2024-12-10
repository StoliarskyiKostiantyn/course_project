import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Test Post' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This is a test post' })
  @IsNotEmpty()
  content: string;
}
