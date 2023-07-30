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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signUp(authDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signIn(authDto);
  }

}
