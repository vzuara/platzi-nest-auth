import { Controller, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiKeyGuard } from './auth/guards/api-key.guard';
import { Public } from './auth/decorators/public.decorator';

@UseGuards(ApiKeyGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @SetMetadata('isPublic', true)
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('nuevo')
  // @SetMetadata('isPublic', true)
  @Public()
  newEndpoint() {
    return 'yo soy nuevo';
  }

  @Get('/ruta/')
  hello() {
    return 'con /sas/';
  }

  @Get('tasks')
  getTasks() {
    return this.appService.getTasks();
  }
}
