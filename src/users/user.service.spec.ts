import { HashingServiceProtocol } from "src/auth/hash/hashing.service"
import { UsersService } from "./users.service"
import { PrismaService } from "src/prisma/prisma.service"
import { before } from "node:test";
import { Test, TestingModule } from "@nestjs/testing";

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
          useValue: {}
        },
        {
          provide: HashingServiceProtocol,
          useValue: {}
        }
      ]
    }).compile()


    userService = module.get<UsersService>(UsersService)
    prismaService = module.get<PrismaService>(PrismaService)
    hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol)
  })



  it('should be defined users service', () => {
    console.log(userService)
    expect(userService).toBeDefined()
  })

})