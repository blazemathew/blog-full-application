import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreatePostDto } from 'src/dtos/create-post.dto';
import { UpdatePostDto } from 'src/dtos/update-post.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(req.user.id, createPostDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Req() req, @Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(req.user.id, +id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Req() req, @Param('id') id: string) {
    return this.postService.remove(req.user.id, +id);
  }
}
