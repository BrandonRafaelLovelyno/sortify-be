import {
  Controller,
  Get,
  Param,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { Request } from 'express';
import { Cookie } from '../common/cookie';

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
}
