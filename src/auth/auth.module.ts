import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
