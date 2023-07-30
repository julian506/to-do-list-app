import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async hashData(data: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(data, salt);
  }

  async updateRefreshToken(userId: number, refresh_token: string) {
    const hashedRefreshToken = await this.hashData(refresh_token);

    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken,
      },
    });
  }

  async getTokens(userId: number, email: string) {
    const access_token = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      },
    );

    const refresh_token = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );

    return {
      access_token,
      refresh_token,
    };
  }

  async signUp(authDto: AuthDto): Promise<Tokens> {
    const hashedPassword = await this.hashData(authDto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: authDto.email,
        password: hashedPassword,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async signIn(authDto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compare(
      authDto.password,
      user.password,
    );

    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

}
