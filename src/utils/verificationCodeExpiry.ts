import moment, { MomentInput } from 'moment';
import { VERIFICATION_CODE_EXPIRY } from './constants';
import { Date } from 'mongoose';

export const isVerificationCodeExpired = (verificationCodeExpiry: Date) => {
  const now = moment();

  const expiry = moment(verificationCodeExpiry as MomentInput);

  if (expiry.diff(now, 'minutes') > VERIFICATION_CODE_EXPIRY) {
    return true;
  }
  return false;
};
