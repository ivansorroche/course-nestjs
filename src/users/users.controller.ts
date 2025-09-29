import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/auth/common/auth.constants';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Get(':id')
  findOndeUser(@Param('id', ParseIntPipe) id: number) {
    console.log(" TOKEN ", process.env.TOKEN_KEY)
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
    @Req() request: Request
  ) {
    console.log("request", request[REQUEST_TOKEN_PAYLOAD_NAME])
    return this.userService.updateUser(id, updateUserDto)
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id)
  }
}
