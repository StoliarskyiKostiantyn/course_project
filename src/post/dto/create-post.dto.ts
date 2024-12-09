import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Test Post' })
  title: string;
  @ApiProperty({ example: 'This is a test post' })
  content: string;
}
