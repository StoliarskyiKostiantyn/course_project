import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostEntity } from './post.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiBody({ type: CreatePostDto })
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: RequestWithUser,
  ): Promise<PostEntity> {
    const userId = req.user.id;
    return this.postService.create(createPostDto, userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<PostEntity[]> {
    const userId = req.user.id;
    return this.postService.findAll(userId);
  }
}