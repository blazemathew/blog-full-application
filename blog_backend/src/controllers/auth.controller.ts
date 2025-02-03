import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { FacebookAuthGuard } from 'src/guards/facebook-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.login(req.user);
    
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`;
    
    return res.redirect(redirectUrl);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthCallback(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.login(req.user);
    
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`;
    
    return res.redirect(redirectUrl);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req) {
    const user = req.user;
    return this.authService.refreshToken(user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    const user = req.user;
    await this.authService.logout(user.id);
    return { message: 'Logged out successfully' };
  }
}