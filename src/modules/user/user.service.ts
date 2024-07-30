import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ActivateUserDto } from './dto/activateUser.dto';
import { AVATAR_FOLDER } from 'src/utils/constants';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';
import { generateVerificationCode } from 'src/utils/verificationCode';
import { isVerificationCodeExpired } from 'src/utils/verificationCodeExpiry';
import { MailService } from 'src/shared/services/mail.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cloudinaryService: CloudinaryService,
    private mailService: MailService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, username } = registerUserDto;

    const isEmailExists = await this.userModel.exists({ email });
    if (isEmailExists) {
      throw new ConflictException('Email already exists.');
    }

    const verificationCode = generateVerificationCode();

    await this.userModel.create({ verificationCode, ...registerUserDto });

    this.mailService.sendMail({
      email,
      subject: 'Activate your account',
      template: 'activation-mail.ejs',
      data: { username, verificationCode },
    });

    return `Verification code is sent to: ${email}`;
  }

  async activateUser(email: string, { verificationCode }: ActivateUserDto) {
    const user = await this.userModel.findOne({ email, is_verified: false });
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const { verificationCode: userVerificationCode, verificationCodeExpiry } =
      user;

    if (isVerificationCodeExpired(verificationCodeExpiry)) {
      throw new BadRequestException('Verification code has expired.');
    }

    if (verificationCode !== userVerificationCode) {
      throw new BadRequestException('Invalid verification code.');
    }

    user.is_verified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;

    await user.save();

    return 'Account verified.';
  }

  async updateAvatar(userId: string, avatar: string, cloudinaryId: string) {
    const user = await this.userModel.findById(userId);

    this.cloudinaryService.deleteImageResource(
      AVATAR_FOLDER,
      user.cloudinaryId,
    );

    user.avatar = avatar;
    user.cloudinaryId = cloudinaryId;

    await user.save();

    return 'Avatar updated.';
  }

  async deleteAvatar(userId: string) {
    const user = await this.userModel.findById(userId);

    this.cloudinaryService.deleteImageResource(
      AVATAR_FOLDER,
      user.cloudinaryId,
    );

    user.avatar = undefined;
    user.cloudinaryId = undefined;

    await user.save();

    return 'Avatar deleted.';
  }

  getProfile(userId: string) {
    return this.userModel
      .findById(userId)
      .select('username email avatar cloudinaryId');
  }

  updateProfile(userId: string, updateProfileDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(userId, updateProfileDto, { new: true })
      .select('-password');
  }
}
