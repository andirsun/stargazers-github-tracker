import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('repos/new')
  addNewRepo(@Query('repo')repo : string) {
    return this.appService.addNewRepo(repo);
  }

  @Get('repos/stargazers')
  getStargazers(@Query('repo')repo : string) {
    return this.appService.getStargazers(repo);
  }




}
