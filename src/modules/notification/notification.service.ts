import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  getUnreadNotificationsOfAUser(userId: string) {
    return this.notificationModel
      .find({ userId, isUserRead: false })
      .sort({ createdAt: -1 });
  }

  async markAllNotificationsAsReadOfUser(userId: string) {
    await this.notificationModel.updateMany(
      { userId },
      { $set: { isUserRead: true } },
    );

    return 'All notification mark as read.';
  }

  getAllUnreadNotificationsOfAdmin() {
    return this.notificationModel
      .find({ isAdminRead: true, type: 'NO' })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 })
      .select('createdAt userId orderId type');
  }

  async markAllNotificationsAsReadOfAdmin() {
    await this.notificationModel.updateMany(
      {},
      { $set: { isAdminRead: true } },
    );

    return 'All notification mark as read.';
  }
}
