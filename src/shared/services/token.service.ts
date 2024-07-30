import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { model, Model } from 'mongoose';
import { User, UserSchema } from 'src/modules/user/schemas/user.schema';

@Injectable()
export class TokenService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async refreshAccessToken(userId: string) {
    const user = await this.userModel.findById(userId);

    return user.get('signAccessToken');
  }
}
