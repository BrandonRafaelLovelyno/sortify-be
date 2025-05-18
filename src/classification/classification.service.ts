import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ClassificationService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

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

  async getUserClassifications(token: string) {
    const user = await this.userService.getUserFromToken(token);

    const classifications = await this.prisma.classification.findMany({
      where: {
        waste: {
          userId: user.userId,
        },
      },
      include: {
        wasteCategory: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return classifications;
  }
}
