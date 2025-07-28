import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/teste')
  getTeste(): string {
    return 'Teste endpoint!';
  }

  @Post('/teste123')
  postTeste(): string {
    return 'Teste POST endpoint!';
  }
}
