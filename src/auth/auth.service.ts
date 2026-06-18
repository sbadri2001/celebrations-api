import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
      },
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(dto.password, user.passwordHash);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string) {
    const records = await this.prisma.refreshToken.findMany({
      include: {
        user: true,
      },
    });

    for (const record of records) {
      const valid = await bcrypt.compare(refreshToken, record.tokenHash);

      if (valid) {
        if (record.expiresAt < new Date()) {
          throw new UnauthorizedException('Refresh token expired');
        }

        await this.prisma.refreshToken.delete({
          where: {
            id: record.id,
          },
        });

        return this.generateTokens(record.user);
      }
    }

    throw new UnauthorizedException('Invalid refresh token');
  }

  async logout(refreshToken: string) {
    const records = await this.prisma.refreshToken.findMany();

    for (const record of records) {
      const valid = await bcrypt.compare(refreshToken, record.tokenHash);

      if (valid) {
        await this.prisma.refreshToken.delete({
          where: {
            id: record.id,
          },
        });

        return {
          message: 'Logged out successfully',
        };
      }
    }

    return {
      message: 'Already logged out',
    };
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as StringValue,
    });

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
