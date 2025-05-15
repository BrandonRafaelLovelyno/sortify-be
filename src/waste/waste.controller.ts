import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { WasteService } from './waste.service';
import { Request } from 'express';
import { Cookie } from 'src/common/cookie';
import { WeeklyProgressResult } from './waste.dto';

@Controller('waste')
export class WasteController {
  constructor(
    private readonly wasteService: WasteService,
    private readonly cookie: Cookie,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('weekly-progress')
  async getWeeklyProgress(
    @Req() request: Request,
  ): Promise<WeeklyProgressResult> {
    const token = this.cookie.getCookie(request, 'auth_token');
    return await this.wasteService.getWeeklyProgress(token);
  }
}
