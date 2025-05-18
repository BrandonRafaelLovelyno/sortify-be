import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  calculateGrowthPercentage,
  calculatePercentage,
  getWasteCountsByTime,
} from './classification.helper';

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

  async getWeeklyProgress(token: string) {
    const user = await this.userService.getUserFromToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const now = new Date();
    const currentWeekCounts = await getWasteCountsByTime(
      this.prisma,
      user.userId,
      now,
      false,
    );

    const previousWeekCounts = await getWasteCountsByTime(
      this.prisma,
      user.userId,
      now,
      true,
    );

    const percentages = {
      organik: calculateGrowthPercentage(
        currentWeekCounts.organik,
        previousWeekCounts.organik,
      ),
      anorganik: calculateGrowthPercentage(
        currentWeekCounts.anorganik,
        previousWeekCounts.anorganik,
      ),
      b3: calculateGrowthPercentage(
        currentWeekCounts.b3,
        previousWeekCounts.b3,
      ),
    };

    return {
      count: currentWeekCounts,
      percentage: percentages,
    };
  }
}
