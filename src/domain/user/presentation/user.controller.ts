import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import {
  TokenResponse,
  UpdateUserAccountIdRequest,
  UserResponse,
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

  @Get('/list')
  async getUserList(): Promise<UserResponse> {
    return await this.userService.getUserList();
  }

  @Put()
  @UseGuards(JwtGuard)
  async updateUserAccountId(
    @CurrentUser() user: UserEntity,
    @Body() request: UpdateUserAccountIdRequest,
  ) {
    await this.userService.updateUserAccountId(user, request);
  }
}
