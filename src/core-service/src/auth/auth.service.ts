import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma';
import { HashService } from './hash.service';
import { TokenService } from './token.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly hashService: HashService,
  ) {}

  async createUser(userData: CreateUserDto) {
    const hashedPassword = await this.hashService.hash(userData.password);
    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        passwordHash: hashedPassword,
      },
    });
    const tokenPair = await this.tokenService.generateTokenPair(
      user.id,
      user.email,
      user.role,
    );

    return { id: user.id, tokenPair };
  }
}
