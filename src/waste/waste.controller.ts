import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post('classify')
  @UseInterceptors(FileInterceptor('file'))
  async classifyWaste(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<{ classificationId: string }> {
    return this.wasteService.classifyWaste(file, request);
  }
}
