import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Get(':id')
  findOndeUser(@Param('id', ParseIntPipe) id: number) {

    return this.userService.findOne(id)
  }

  @Post()
  createUser(@Body() createUserDto: createUserDto) {
    return this.userService.createUser(createUserDto)
  }

  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto)
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id)
  }
}
