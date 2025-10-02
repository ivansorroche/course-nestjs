import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { FileInterceptor } from '@nestjs/platform-express';

//para manipular arquivos
import * as path from 'node:path'
import * as fs from 'node:fs/promises'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Get(':id')
  findOndeUser(@Param('id', ParseIntPipe) id: number) {
    // console.log(" TOKEN ", process.env.TOKEN_KEY)
    return this.userService.findOne(id)
  }

  @Post()
  createUser(@Body() createUserDto: createUserDto) {
    return this.userService.createUser(createUserDto)
  }


  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto
  ) {
    console.log(tokenPayloadParam)
    return this.userService.updateUser(id, updateUserDto, tokenPayloadParam)
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto
  ) {
    console.log(tokenPayloadParam)
    return this.userService.deleteUser(id, tokenPayloadParam)
  }

  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadAvatar(
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto,
    @UploadedFile() file: Express.Multer.File
  ) {

    const mimeType = file.mimetype
    const fileExtension = path.extname(file.originalname).toLowerCase().substring(1)

    console.log(file)
    console.log(mimeType)
    console.log(fileExtension)

    const fileName = `${tokenPayloadParam.sub}-avatar.${fileExtension}`
    const fileLocale = path.resolve(process.cwd(), 'files', fileName)

    await fs.writeFile(fileLocale, file.buffer)
    console.log(fileName, 'fileName')

    return true
  }
}
