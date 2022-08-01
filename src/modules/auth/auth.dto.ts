import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsObject,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

// export class CreateUserDto {
//   @ApiProperty()
//   @IsEmail()
//   @IsNotEmpty()
//   email: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   @Matches(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//   )
//   password: string;
// }

export class CheckTokenDto {
  @IsObject()
  user: { id: string };
}
