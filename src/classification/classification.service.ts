import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassificationService {
  constructor(private prisma: PrismaService) {}

  async getClassificationById(id: string) {
    const classification = await this.prisma.classification.findUnique({
      where: { id },
      include: {
        wasteCategory: {
          include: {
            bin: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });

    if (!classification) {
      throw new NotFoundException('Classification not found');
    }

    return {
      ...classification,
      categoryName: classification.wasteCategory.name,
      binImage: classification.wasteCategory.bin.image,
    };
  }
}
