import { HashingServiceProtocol } from "src/auth/hash/hashing.service"
import { UsersService } from "./users.service"
import { PrismaService } from "src/prisma/prisma.service"
import { before } from "node:test";
import { Test, TestingModule } from "@nestjs/testing";
import { createUserDto } from "./dto/create-user.dto";
import { Task } from "src/tasks/entities/task.entity";
import { HttpException, HttpStatus } from "@nestjs/common";
import { create } from "domain";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Payload } from "generated/prisma/runtime/library";
import { PayloadTokenDto } from "src/auth/dto/payload-token.dto";

// AAA
// 1º Configuração do teste (Arrange)
// 2º Ação do teste (Act)
// 3º Verificação do teste (Assert)

describe('UserService', () => {
  let userService: UsersService;
  let prismaService: PrismaService;
  let hashingService: HashingServiceProtocol;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Ivan',
                email: 'ivan@gmail.com'
              }),
              findFirst: jest.fn(),
              update: jest.fn()
            }
          }
        },
        {
          provide: HashingServiceProtocol,
          useValue: {
            hash: jest.fn()
          }
        }
      ]
    }).compile()


    userService = module.get<UsersService>(UsersService)
    prismaService = module.get<PrismaService>(PrismaService)
    hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol)
  })

  it('should be defined users service', () => {
    expect(userService).toBeDefined()
  })

  describe('createUser', () => {

    it('should create a new user', async () => {

      //AAA - Arrange
      const createUserDto: createUserDto = {
        email: 'ivan@gmail.com',
        name: 'Ivan',
        password: '123456'
      }

      //AAA - Arrange
      //mockando o retorno do hash
      jest.spyOn(hashingService, 'hash').mockResolvedValue('hashedPassword')

      //AAA - Act
      //chamando o serviço
      const result = await userService.createUser(createUserDto)

      //AAA - assert
      //verificando se o serviço para gerar o hash está sendo chamado
      expect(hashingService.hash).toHaveBeenCalled()

      //AAA - assert
      //Salvando os dados com o prisma
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: 'hashedPassword'
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      })

      expect(result).toEqual({
        id: 1,
        name: 'Ivan',
        email: 'ivan@gmail.com'
      })
    })

    it('should throw an exception when create user fails', async () => {

      const createUserDto: createUserDto = {
        email: 'ivan@gmail.com',
        name: 'Ivan',
        password: '123456'
      }
      jest.spyOn(hashingService, 'hash').mockResolvedValue('hashedPassword')
      expect(hashingService.hash).not.toHaveBeenCalledWith(createUserDto.password)

      jest.spyOn(prismaService.user, 'create').mockRejectedValue(new Error('Database error'))
      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        new HttpException("falha ao cadastrar usuário", HttpStatus.BAD_REQUEST)
      )
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: 'hashedPassword'
        },
        select: {
          id: true,
          name: true,
          email: true
        }

      })
    }
    )

  })

  describe('FindUser', () => {

    it('should return a user when found', async () => {

      const mockUser = {
        id: 1,
        name: 'Ivan',
        email: 'ivan@gmail.com',
        avatar: null,
        createdAt: new Date(),
        Task: [],
        passwordHash: 'hashedPassword',
        active: true
      }

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser)

      const result = await userService.findOne(1)

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          Task: true,
        }
      })

      expect(result).toEqual(mockUser)
    })

    it('should throw an exception when user not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null)

      await expect(userService.findOne(1)).rejects.toThrow(
        new HttpException("Usuario não encontrado", HttpStatus.BAD_REQUEST)
      )

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          Task: true,
        }
      })

    })
  })

  describe('UpdateUser', () => {

    it('should throw exception when user is not found', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Ivan Updated'
      }

      const tokenPayload: PayloadTokenDto = {
        sub: 2,
        email: 'ivan@gmail.com',
        aud: '',
        exp: 0,
        iat: 0,
        iss: ''
      }

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null)

      await expect(userService.updateUser(1, updateUserDto, tokenPayload)).rejects.toThrow(
        new HttpException("falha ao atualizar usuário", HttpStatus.BAD_REQUEST)
      )

    })

    it('should trow unauthorized exception when user id does not match token payload', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Ivan Updated'
      }
      const tokenPayload: PayloadTokenDto = {
        sub: 2,
        email: 'ivan@gmail.com',
        aud: '',
        exp: 0,
        iat: 0,
        iss: ''
      }

      const mockUser = {
        id: 1,
        name: 'Ivan',
        email: 'ivan@gmail.com',
        avatar: null,
        createdAt: new Date(),
        Task: [],
        passwordHash: 'hashedPassword',
        active: true
      }

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser)

      await expect(userService.updateUser(1, updateUserDto, tokenPayload)).rejects.toThrow(
        new HttpException("falha ao atualizar usuário", HttpStatus.BAD_REQUEST)
      )


    })

    it('should update user successfully', async () => {

      const updateUserDto: UpdateUserDto = {
        name: 'Ivan Updated',
        password: 'newPassword'
      }
      const tokenPayload: PayloadTokenDto = {
        sub: 1,
        email: 'ivan@gmail.com',
        aud: '',
        exp: 0,
        iat: 0,
        iss: ''
      }

      const mockUser = {
        id: 1,
        name: 'Ivan',
        email: 'ivan@gmail.com',
        avatar: null,
        createdAt: new Date(),
        Task: [],
        passwordHash: 'hashedPassword',
        active: true
      }

      const updateMockUser = {
        id: 1,
        name: 'Ivan',
        email: 'ivan@gmail.com',
        avatar: null,
        createdAt: new Date(),
        Task: [],
        passwordHash: 'new_hashedPassword',
        active: true
      }

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser)

      jest.spyOn(hashingService, 'hash').mockResolvedValue('new_hashedPassword')

      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updateMockUser)

      const result = await userService.updateUser(1, updateUserDto, tokenPayload)

      expect(hashingService.hash).toHaveBeenCalledWith(updateUserDto.password)
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: {
          name: updateUserDto.name,
          passwordHash: 'new_hashedPassword',
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      })

      expect(result).toEqual(updateMockUser)

    })

  })
})