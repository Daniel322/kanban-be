import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Req,
  Get,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AccessGuard, RefreshGuard, GoogleGuard } from '../../common/guards';

import { CreateUserDto } from '../users/users.dto';

import { AuthService } from './auth.service';
import { LoginUserDto, CheckTokenDto } from './auth.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'check token and get user',
  })
  @UseGuards(AccessGuard)
  @Get('/check-token')
  async checkToken(@Req() req: CheckTokenDto) {
    try {
      return this.authService.getUserfromTokenGuard(req.user.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'login request',
  })
  @Post('/login')
  async loginUser(@Body() body: LoginUserDto) {
    try {
      return this.authService.loginUser(body);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Create user',
  })
  @Post('/signup')
  async signupUser(@Body() body: CreateUserDto) {
    try {
      return this.authService.signupUser(body);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'refresh request',
  })
  @UseGuards(RefreshGuard)
  @Post('/refresh')
  async refresh(@Req() req) {
    try {
      return this.authService.refresh(req.user, req.body);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @ApiResponse({
    status: 200,
    description: 'endpoint for social auth in google',
  })
  @UseGuards(GoogleGuard)
  @Get('/google')
  async googleAuth(@Req() req) {
    console.log(req);
  }

  @ApiResponse({
    status: 200,
    description: 'redirect endpoint for get user from google',
  })
  @UseGuards(GoogleGuard)
  @Get('/google/redirect')
  async googleAuthRedirect(@Req() req, @Res() res) {
    return this.authService.googleLogin(req, res);
  }
}
