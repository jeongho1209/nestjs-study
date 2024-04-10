import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenResponse } from '../../domain/user/presentation/dto/user.dto';

@Injectable()
export class JwtProvider {
  constructor(
    private readonly jwtService: JwtService,
    // refreshToken 추가 필요
  ) {}

  async generateToken(accountId: string): Promise<TokenResponse> {
    const token = await this.signJwt(accountId, '1h');
    return {
      accessToken: token,
    };
  }

  private async signJwt(accountId: string, exp: string) {
    const payload = { sub: accountId, expire: exp };
    return await this.jwtService.signAsync(payload);
  }
}
