import { NextFunction } from 'express';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';

import { UserRole } from '../enum/userRole.enum';
import { verifyHash } from 'src/utils/verifyHash';
import { hash } from 'src/utils/hash';
import { Date } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  username: string;

  @Prop({ required: true, trim: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.User })
  role: string;

  @Prop({ default: false })
  is_verified: boolean;

  @Prop({ required: true })
  verificationCode: number;

  @Prop({ type: Date, default: Date.now })
  verificationCodeExpiry: Date;

  @Prop()
  avatar: string;

  @Prop()
  cloudinaryId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: NextFunction) {
  if (this.isModified('password')) {
    this.password = await hash(this.password);
  }

  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await verifyHash(this.password, candidatePassword);
};

UserSchema.virtual('signAccessToken').get(function () {
  return sign(
    {
      user: {
        _id: this._id,
        username: this.username,
        email: this.email,
        role: this.role,
        avatar: this.avatar,
        cloudinaryId: this.cloudinaryId,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' },
  );
});

UserSchema.virtual('signRefreshToken').get(function () {
  return sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
});
