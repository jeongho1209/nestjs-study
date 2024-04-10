import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserSignInRequest, UserSignUpRequest } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signUp(@Body() request: UserSignUpRequest) {
    await this.userService.signUp(request);
  }

  @Post('/signIn')
  async signIn(@Body() request: UserSignInRequest): Promise<string> {
    return await this.userService.signIn(request);
  }
}
