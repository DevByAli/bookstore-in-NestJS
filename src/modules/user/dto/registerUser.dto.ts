import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { EMAIL_REGEX } from 'src/utils/constants';

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(EMAIL_REGEX, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
    })
    password: string;
}
