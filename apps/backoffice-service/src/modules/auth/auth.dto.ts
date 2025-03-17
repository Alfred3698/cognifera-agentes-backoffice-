import { IsString } from 'class-validator';

export class UsersDto {
  @IsString()
  userName: string;
  @IsString()
  password: string;
}
