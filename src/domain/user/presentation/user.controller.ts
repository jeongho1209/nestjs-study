import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import {
  TokenResponse,
  UserSignInRequest,
  UserSignUpRequest,
} from './dto/user.dto';
import { CurrentUser } from '../../../global/decorator/current-user.decorator';
import { UserEntity } from '../entity/user.entity';
import { JwtGuard } from '../../../global/guard/jwt.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signUp(@Body() request: UserSignUpRequest) {
    await this.userService.signUp(request);
  }

  @Post('/signIn')
  async signIn(@Body() request: UserSignInRequest): Promise<TokenResponse> {
    return await this.userService.signIn(request);
  }

  @Delete()
  @UseGuards(JwtGuard)
  async deleteUser(@CurrentUser() user: UserEntity) {
    await this.userService.deleteUser(user);
  }
}
