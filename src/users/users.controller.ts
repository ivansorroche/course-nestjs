import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { FileInterceptor } from '@nestjs/platform-express';



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
    return this.userService.updateUser(id, updateUserDto, tokenPayloadParam)
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto
  ) {
    return this.userService.deleteUser(id, tokenPayloadParam)
  }

  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadAvatar(
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto,
    @UploadedFile(new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: '/jpeg|png|jpg/g',
      })
      .addMaxSizeValidator({
        maxSize: 1 * (1024 * 1024), //1MB
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
    ) file: Express.Multer.File
  ) {


    return this.userService.uploadAvatarImage(tokenPayloadParam, file)

  }
}
