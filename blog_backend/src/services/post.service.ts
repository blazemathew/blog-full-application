import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity'; // Ensure correct path to Post entity
import { CreatePostDto } from 'src/dtos/create-post.dto';
import { UpdatePostDto } from 'src/dtos/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      user: { id: userId },
    });
    return this.postRepository.save(post);
  }

  async update(userId: number, id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    if (post.user.id !== userId) {
      throw new UnauthorizedException('You can only update your own posts');
    }
    
    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }

  async remove(userId: number, id: number): Promise<void> {
    const post = await this.findOne(id);
    if (post.user.id !== userId) {
      throw new UnauthorizedException('You can only delete your own posts');
    }
    await this.postRepository.remove(post);
  }
}
