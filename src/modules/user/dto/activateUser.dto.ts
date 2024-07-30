import { IsNotEmpty, IsNumber, IsPositive, MinLength, MaxLength } from 'class-validator';

export class ActivateUserDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  verificationCode: number;
}
