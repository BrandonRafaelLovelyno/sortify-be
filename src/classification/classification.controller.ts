import { Controller, Get, Param } from '@nestjs/common';
import { ClassificationService } from './classification.service';

@Controller('classification')
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get(':id')
  async getClassification(@Param('id') id: string) {
    return this.classificationService.getClassificationById(id);
  }
}
