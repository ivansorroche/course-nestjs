import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,
  ) { }

  async authenticate(signInDto: SignInDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: signInDto.email
      }
    })

    if (!user) throw new HttpException("falha ao realizar o Login", HttpStatus.UNAUTHORIZED)

    const passwordIsValid = await this.hashingService.compare(signInDto.password, user.passwordHash)

    if (!passwordIsValid) throw new HttpException("Senha/Usuário inválidos", HttpStatus.UNAUTHORIZED)

    return user

  }
}
