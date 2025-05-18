import { Controller, Get, Param, Req } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { Request } from 'express';
import { Cookie } from 'src/common/cookie';

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

  @Get(':id')
  async getClassification(@Param('id') id: string) {
    return this.classificationService.getClassificationById(id);
  }
}
