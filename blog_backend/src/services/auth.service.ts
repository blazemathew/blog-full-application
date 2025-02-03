import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Save or update the user and store the refresh token
  async validateUser(profile: any, refreshToken?: string): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { provider: profile.provider, providerId: profile.id },
    });

    if (!user) {
      user = this.userRepository.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        provider: profile.provider,
        providerId: profile.id,
        refreshToken, // Save refresh token if available
      });
      await this.userRepository.save(user);
    } else if (refreshToken) {
      user.refreshToken = refreshToken; // Update refresh token if provided
      await this.userRepository.save(user);
    }

    return user;
  }

  // Handle login and return access token and refresh token
  async login(user: User) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      name: user.name,
      provider: user.provider
    };
    
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION')
    });
  
    // Update user's refresh token in database
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
  
    return {
      access_token: accessToken,
      refresh_token: refreshToken
    };
  }

  // Handle token refresh (refresh access token using refresh token)
  async refreshToken(user: User) {
    // Verify the stored refresh token
    if (!user.refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }
  
    try {
      // Generate new tokens
      const payload = { sub: user.id, email: user.email };
      const newAccessToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION')
      });
      
      const newRefreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION')
      });
  
      // Update refresh token in database
      user.refreshToken = newRefreshToken;
      await this.userRepository.save(user);
  
      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      refreshToken: null
    });
  }
}
