import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../domain/user/entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.getTokenFromHeader(request.headers['authorization']);

    if (token === null) {
      return true;
    }

    const sub = this.parseToken(token);
    const currentUser = await this.queryUserByAccountId(sub['sub']);
    request.user = new UserEntity(currentUser.accountId, currentUser.password);

    return Boolean(currentUser);
  }

  private parseToken(token: string) {
    let parsed: any;
    try {
      parsed = this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    return parsed;
  }

  private getTokenFromHeader(header: any): string {
    return header?.substring(7);
  }

  private async queryUserByAccountId(accountId: string): Promise<UserEntity> {
    const currentUser = await this.userRepository.findOneBy({
      accountId: accountId,
    });

    if (!currentUser) {
      throw new UnauthorizedException('User Not Found');
    }

    return currentUser;
  }
}
