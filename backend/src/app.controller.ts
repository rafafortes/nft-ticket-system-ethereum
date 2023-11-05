import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('event-data')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getEventData(): object {
    return this.appService.getEventData();
  }

  @Get('sign-message')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  signMessage(): Promise<any> {
    return this.appService.signMessage();
  }

  @Get('contract')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getContract(): object {
    return this.appService.getContract();
  }
}
