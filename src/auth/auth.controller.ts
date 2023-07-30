import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/tokens.types';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signUp(authDto);
  }

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signIn(authDto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

}
