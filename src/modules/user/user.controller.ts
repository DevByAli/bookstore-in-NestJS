import { Body, Controller, Delete, Get, Patch, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { ActivateUserDto } from './dto/activateUser.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async registerUser(@Body() registerUserDto: RegisterUserDto, @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.userService.register(registerUserDto);

    res.cookie('email', registerUserDto.email, { maxAge: 300000 });

    return result;
  }

  @Post('activate')
  async activateUser(@Req() req: Request, @Body() activateUserDto: ActivateUserDto,
  ) {
    const { email } = req.cookies;

    return await this.userService.activateUser(email, activateUserDto);
  }

  @Patch('update-avatar')
  async updateAvatar(@Req() req: Request) {
    const userId = req.user._id.toString();
    
    const { path: avatar } = req.files[0];
    const cloudinaryId = avatar.split('/').pop();

    return await this.userService.updateAvatar(userId, avatar, cloudinaryId);
  }

  @Delete('delete-avatar')
  async deleteAvatar(@Req() req: Request) {
    const { _id: userId } = req.user;

    return await this.userService.deleteAvatar(userId);
  }

  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userId = req.user._id.toString();

    return await this.userService.getProfile(userId);
  }

  @Patch('update-profile')
  async updateProfile( @Req() req: Request, @Body() updateProfileDto: UpdateUserDto,
  ) {
    const userId = req.user._id.toString();

    return this.userService.updateProfile(userId, updateProfileDto);
  }
}
