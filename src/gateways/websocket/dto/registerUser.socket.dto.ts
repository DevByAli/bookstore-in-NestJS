import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/modules/user/enum/userRole.enum';

export class SocketRegisterUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
