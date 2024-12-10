import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostEntity } from './post.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    @Inject(CACHE_MANAGER) private cacheManager,
  ) {}

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
    const cacheKey = `user_posts_${userId}`;
    const cachedPosts = await this.cacheManager.get(cacheKey);

    if (cachedPosts) {
      console.log('Returning cached posts');
      return cachedPosts;
    }
    console.log('Returning fresh posts');
    const posts = await this.postService.findAll(userId);
    await this.cacheManager.set(cacheKey, posts);
    return posts;
  }
}
