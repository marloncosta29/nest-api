import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signIn(signInDTO: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: signInDTO.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const pwMatches = argon.verify(user.hash, signInDTO.password);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    return this.signInToken(user.id, user.email);
  }
  async signUp(signUpDTO: AuthDto) {
    try {
      //gera umam hash usando o argon 2
      const hash = await argon.hash(signUpDTO.password);
      //cria o usuario no banco de dados
      const user = await this.prismaService.user.create({
        data: {
          email: signUpDTO.email,
          hash,
        },
      });
      return this.signInToken(user.id, user.email);
    } catch (error) {
      //caso haja um erro
      if (error instanceof PrismaClientKnownRequestError) {
        //verifica se o erro é do Prisma e so é de duplicidadde (P2002)
        if (error.code === 'P2002') {
          //retorna uma exception
          throw new ForbiddenException('Credentilas taken');
        }
      }
      throw error;
    }
  }
  async signInToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email,
    };
    const secret = this.config.get('JWT_SECRET');
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
    return {
      access_token,
    };
  }
}
