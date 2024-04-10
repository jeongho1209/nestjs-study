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

    const token = this.getTokenFromHeader(request.headers);

    if (token === null) {
      return true;
    }

    const sub = this.parseToken(token);
    const currentUser = await this.userRepository.findOneBy({
      accountId: sub,
    });

    return Boolean(currentUser);
  }

  private parseToken(token: string) {
    let parsed: any;
    try {
      parsed = this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    if (parsed.typ != 'access') {
      throw new UnauthorizedException('Invalid Token');
    }
    return parsed;
  }

  private getTokenFromHeader(header: any): string {
    return header?.substring(7);
  }
}
