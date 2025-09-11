import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private hashingService: HashingServiceProtocol
  ) { }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        Task: true

      }
    })

    if (user) return user;

    throw new HttpException("Usuario não encontrado", HttpStatus.BAD_REQUEST)
  }

  async createUser(createUserDto: createUserDto) {
    try {

      const passwordHash = await this.hashingService.hash(createUserDto.password)
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: passwordHash
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      })

      return user;
    } catch (error) {
      console.log(error)
      throw new HttpException("falha ao cadastrar usuário", HttpStatus.BAD_REQUEST)

    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id
        },
      })

      if (!user) {
        throw new HttpException("Usuário não encontrado", HttpStatus.BAD_REQUEST)
      }

      const dataUser: { name?: string, passwordHash?: string } = {
        name: updateUserDto.name ? updateUserDto.name : user.name
      }

      if (updateUserDto.password) {
        const passwordHash = await this.hashingService.hash(updateUserDto.password)
        dataUser['passwordHash'] = passwordHash
      }

      if (updateUserDto.name) {
        dataUser.name = updateUserDto.name
      }

      if (updateUserDto.password) {
        dataUser.passwordHash = await this.hashingService.hash(updateUserDto.password)
      }

      const updateUser = await this.prisma.user.update({
        where: {
          id: id
        },
        data: {
          name: dataUser.name,
          passwordHash: dataUser.passwordHash ?? user.passwordHash

        },
        select: {
          id: true,
          name: true,
          email: true
        }
      })

      return updateUser;

    } catch (error) {
      throw new HttpException("falha ao atualizar usuário", HttpStatus.BAD_REQUEST)

    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id
        },
      })

      if (!user) {
        throw new HttpException("Usuário não encontrado", HttpStatus.BAD_REQUEST)
      }

      await this.prisma.user.delete({
        where: {
          id: user.id
        }
      })

      return {
        message: `Usuário com nome/id ${id}/${user.name} deletado com sucesso!`
      }


    } catch (error) {
      throw new HttpException("falha ao deletar usuário", HttpStatus.BAD_REQUEST)
    }
  }

}
