import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY') || 'default-secret',
    });
  }

  async validate(payload: JwtPayload) {
    const { id, role } = payload;

    let user: any = null;

    if (role === 'user') {
      user = await this.prisma.user.findUnique({ where: { id } });
    } else if (role === 'admin') {
      user = await this.prisma.admin.findUnique({ where: { id } });
    } else if (role === 'super_admin') {
      user = await this.prisma.superAdmin.findUnique({ where: { id } });
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { id: user.id, email: user.email, role };
  }
}
