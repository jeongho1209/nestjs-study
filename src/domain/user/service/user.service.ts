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
  UserSignInRequest,
  UserSignUpRequest,
} from '../presentation/dto/user.dto';
import { JwtProvider } from '../../../global/security/jwt.provider';

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

    await this.userRepository.save(
      new UserEntity(request.accountId, request.password),
    );
  }

  async signIn(request: UserSignInRequest): Promise<string> {
    const user = await this.userRepository.findOneBy({
      accountId: request.accountId,
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    if (request.password !== user.password) {
      throw new UnauthorizedException('Password Mis Match');
    }

    return this.jwtProvider.generateToken(request.accountId);
  }
}
