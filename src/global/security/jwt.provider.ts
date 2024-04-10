import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtProvider {
  constructor(
    private readonly jwtService: JwtService,
    // refreshToken 추가 필요
  ) {}

  async generateToken(accountId: string): Promise<string> {
    return await this.signJwt(accountId, '1h');
  }

  private async signJwt(accountId: string, exp: string) {
    const payload = { sub: accountId, expire: exp };
    return await this.jwtService.signAsync(payload);
  }
}
