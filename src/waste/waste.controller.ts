import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WasteService } from './waste.service';
import { Request } from 'express';

@Controller('waste')
export class WasteController {
  constructor(private readonly wasteService: WasteService) {}

  @Post('classify')
  @UseInterceptors(FileInterceptor('file'))
  async classifyWaste(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<{ classificationId: string }> {
    return this.wasteService.classifyWaste(file, request);
  }
}
