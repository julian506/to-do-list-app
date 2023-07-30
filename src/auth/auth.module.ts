import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [AuthService, PrismaService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
