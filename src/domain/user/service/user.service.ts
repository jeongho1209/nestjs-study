import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import {
  TokenResponse,
  UserSignInRequest,
  UserSignUpRequest,
} from '../presentation/dto/user.dto';
import { JwtProvider } from '../../../global/security/jwt.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async signUp(request: UserSignUpRequest) {
    const user = await this.userRepository.findOneBy({
      accountId: request.accountId,
    });

    if (user !== null) {
      throw new ConflictException('User Exists');
    }

    const saltOrRounds = 10;
    const encryptPassword = await bcrypt.hash(request.password, saltOrRounds);

    await this.userRepository.save(
      new UserEntity(request.accountId, encryptPassword),
    );
  }

  async signIn(request: UserSignInRequest): Promise<TokenResponse> {
    const user = await this.userRepository.findOneBy({
      accountId: request.accountId,
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const isInValidPassword = !(await bcrypt.compare(
      request.password,
      user.password,
    ));
    if (isInValidPassword) {
      throw new UnauthorizedException('Password Mis Match');
    }

    return this.jwtProvider.generateToken(request.accountId);
  }

  async deleteUser(user: UserEntity): Promise<void> {
    await this.userRepository.delete(user);
  }
}
