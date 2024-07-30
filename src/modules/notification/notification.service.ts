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

  async createNotification(
    userId: string,
    orderId: string,
    notificationType: string = 'NO',
  ) {
    const newNotification = await this.notificationModel.findOneAndUpdate(
      {
        orderId,
      },
      { userId, orderId, type: notificationType },
      { upsert: true, new: true },
    );

    const notificationId = newNotification._id.toString();

    return await this.populateNotification(notificationId);
  }

  private async populateNotification(notificationId: string) {
    return await this.notificationModel
      .findById(notificationId)
      .populate({
        path: 'userId',
        select: 'username avatar',
      })
      .projection({ userId: 'user', _id: 'id' })
      .select('createdAt userId orderId type');
  }
}
