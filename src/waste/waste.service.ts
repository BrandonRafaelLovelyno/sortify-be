import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Token } from 'src/common/token';
import {
  ClassificationResult,
  MulterFile,
  WeeklyProgressResult,
} from 'src/waste/waste.dto';
import { UserService } from 'src/user/user.service';
import { Waste } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import axios from 'axios';

type WasteWithCategory = Waste & {
  classification?: {
    wasteCategory?: {
      name: string;
    };
  } | null;
};

@Injectable()
export class WasteService {
  FAST_API_URL: string;

  constructor(
    private prismaService: PrismaService,
    private tokenService: Token,
    private userService: UserService,
    private configService: ConfigService,
  ) {
    const url = this.configService.get('FAST_API_URL');

    if (url) {
      this.FAST_API_URL = url;
    } else {
      throw new Error('FAST_API_URL is not defined in the configuration');
    }
  }

  private countWasteByCategory(wastes: WasteWithCategory[]): {
    organik: number;
    anorganik: number;
    b3: number;
  } {
    let organik = 0;
    let anorganik = 0;
    let b3 = 0;

    wastes.forEach((waste) => {
      if (waste.classification?.wasteCategory) {
        const category = waste.classification.wasteCategory.name.toLowerCase();
        if (category.includes('organik')) {
          organik++;
        } else if (category.includes('anorganik')) {
          anorganik++;
        } else if (category.includes('b3')) {
          b3++;
        }
      }
    });

    return {
      organik: parseFloat(organik.toFixed(1)),
      anorganik: parseFloat(anorganik.toFixed(1)),
      b3: parseFloat(b3.toFixed(1)),
    };
  }

  private async getWasteCountsByTime(
    userId: string,
    referenceDate: Date,
  ): Promise<{ organik: number; anorganik: number; b3: number }> {
    const startOfWeek = new Date(referenceDate);
    startOfWeek.setDate(referenceDate.getDate() - referenceDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const wastes = await this.prismaService.waste.findMany({
      where: {
        userId,
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      include: {
        classification: {
          include: {
            wasteCategory: true,
          },
        },
      },
    });

    return this.countWasteByCategory(wastes);
  }

  private calculatePercentage(value: number, total: number): number {
    return total === 0 ? 0 : Math.round((value / total) * 100);
  }

  async getWeeklyProgress(token: string): Promise<WeeklyProgressResult> {
    const userId = this.tokenService.verifyToken(token);
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const now = new Date();

    const currentWeekCounts = await this.getWasteCountsByTime(user.id, now);

    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);

    const totalCurrent =
      currentWeekCounts.organik +
      currentWeekCounts.anorganik +
      currentWeekCounts.b3;

    const percentages = {
      organik: this.calculatePercentage(
        currentWeekCounts.organik,
        totalCurrent,
      ),
      anorganik: this.calculatePercentage(
        currentWeekCounts.anorganik,
        totalCurrent,
      ),
      b3: this.calculatePercentage(currentWeekCounts.b3, totalCurrent),
    };

    return {
      count: currentWeekCounts,
      percentage: percentages,
    };
  }

  async classifyWaste(file: MulterFile): Promise<ClassificationResult> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    try {
      const response = await axios.post(`${this.FAST_API_URL}`, formData);
      return response.data;
    } catch (error) {
      console.log('Error classifying waste image:', error);
      throw new BadRequestException('Failed to classify waste image');
    }
  }
}
