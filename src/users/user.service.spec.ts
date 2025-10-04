import { HashingServiceProtocol } from "src/auth/hash/hashing.service"
import { UsersService } from "./users.service"
import { PrismaService } from "src/prisma/prisma.service"
import { before } from "node:test";
import { Test, TestingModule } from "@nestjs/testing";
import { createUserDto } from "./dto/create-user.dto";

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
})