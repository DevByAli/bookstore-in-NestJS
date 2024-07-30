import { Controller, Get, Patch, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Request } from 'express';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('user')
  getUnreadNotificationsOfAUser(@Req() req: Request) {
    const userId = req.user._id;

    return this.notificationService.getUnreadNotificationsOfAUser(userId);
  }

  @Patch('user')
  markAllNotificationsAsReadOfUser(@Req() req: Request) {
    const userId = req.user._id;

    return this.notificationService.markAllNotificationsAsReadOfUser(userId);
  }

  @Get('admin')
  getAllUnreadNotificationsOfAdmin() {
    return this.notificationService.getAllUnreadNotificationsOfAdmin();
  }

  @Patch('admin')
  markAllNotificationsAsReadOfAdmin() {
    return this.notificationService.markAllNotificationsAsReadOfAdmin();
  }
}
