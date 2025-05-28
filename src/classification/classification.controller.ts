import {
  Controller,
  Get,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { Request } from 'express';
import { Cookie } from '../common/cookie';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('classification')
export class ClassificationController {
  constructor(
    private readonly classificationService: ClassificationService,
    private readonly cookie: Cookie,
  ) {}

  @Get('mine')
  async getMyClassifications(@Req() request: Request) {
    const token = this.cookie.getCookie(request, 'auth_token');
    return await this.classificationService.getUserClassifications(token);
  }

  @HttpCode(HttpStatus.OK)
  @Get('weekly-progress')
  async getWeeklyProgress(@Req() request: Request) {
    const token = this.cookie.getCookie(request, 'auth_token');
    return await this.classificationService.getWeeklyProgress(token);
  }

  @Get(':id')
  async getClassification(@Param('id') id: string) {
    return this.classificationService.getClassificationById(id);
  }

  @Post('waste')
  @UseInterceptors(FileInterceptor('file'))
  async classifyWaste(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<{ classificationId: string }> {
    return this.classificationService.classifyWaste(file, request);
  }

  @Post('bin/:classificationId')
  @UseInterceptors(FileInterceptor('file'))
  async classifyBin(
    @UploadedFile() file: Express.Multer.File,
    @Param('classificationId') classificationId: string,
  ) {
    return this.classificationService.classifyBin(file, classificationId);
  }

  @Get('result/:id')
  async getClassificationResult(@Param('id') id: string) {
    return this.classificationService.getClassificationResult(id);
  }
}
