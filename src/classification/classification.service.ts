import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import {
  calculateGrowthPercentage,
  calculatePercentage,
  getWasteCountsByTime,
} from './classification.helper';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import axios from 'axios';
import { Cookie } from '../common/cookie';
import { Token } from '../common/token';

const CATEGORY_NAME_TO_BIN_NAME: Record<string, string> = {
  'B3 (Merah)': 'B3',
  'Anorganik (Kuning)': 'Anorganik',
  'Organik (Hijau)': 'Organik',
};

@Injectable()
export class ClassificationService {
  FAST_API_URL: string;

  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private configService: ConfigService,
    private cloudinaryService: CloudinaryService,
    private cookie: Cookie,
    private tokenService: Token,
  ) {
    const url = this.configService.get('FAST_API_URL');

    if (url) {
      this.FAST_API_URL = url;
    } else {
      throw new Error('FAST_API_URL is not defined in the configuration');
    }
  }

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

  async classifyWaste(
    file: Express.Multer.File,
    request: any,
  ): Promise<{ classificationId: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const token = this.cookie.getCookie(request, 'auth_token');
    const userId = this.tokenService.verifyToken(token);

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    let prediction;
    try {
      const response = await axios.post(
        `${this.FAST_API_URL}/waste-classification/efficientnet`,
        formData,
      );
      prediction = response.data.prediction;
    } catch (error) {
      throw new BadRequestException(
        'Cannot classify waste image, please try again',
      );
    }

    const wasteCategory = await this.prisma.wasteCategory.findFirst({
      where: {
        name: {
          contains: prediction,
          mode: 'insensitive',
        },
      },
    });

    if (!wasteCategory) {
      throw new BadRequestException('Invalid waste category prediction');
    }

    const { url } = await this.cloudinaryService.uploadImage(file);

    const waste = await this.prisma.waste.create({
      data: {
        userId,
        image: url,
        date: new Date(),
      },
    });

    const classification = await this.prisma.classification.create({
      data: {
        wasteId: waste.id,
        wasteCategoryId: wasteCategory.id,
      },
    });

    return { classificationId: classification.id };
  }

  async classifyBin(file: Express.Multer.File, classificationId: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const { url } = await this.cloudinaryService.uploadImage(file);

    const classification = await this.prisma.classification.findUnique({
      where: { id: classificationId },
      include: {
        wasteCategory: true,
        waste: true,
      },
    });

    if (!classification) {
      throw new NotFoundException('Classification not found');
    }

    const targetBinId = classification.wasteCategory.binId;

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    let response;
    try {
      response = await axios.post(`${this.FAST_API_URL}/detect-bin`, formData);
    } catch (error) {
      throw new BadRequestException(
        'Cannot classify bin image, please try again',
      );
    }

    const mostConfidentBin = this.getMostConfidentBin(response.data.detections);
    const binName = this.getBinName(mostConfidentBin.category);

    const predictedBin = await this.prisma.trashBin.findFirst({
      where: {
        name: {
          contains: binName,
          mode: 'insensitive',
        },
      },
    });

    if (!predictedBin) {
      throw new BadRequestException('Predicted bin not found in database');
    }

    const isSuccess = predictedBin.id === targetBinId;
    const binVerification = await this.prisma.binVerification.create({
      data: {
        predictedBinId: predictedBin.id,
        targetBinId: targetBinId,
        classificationId: classificationId,
        isSuccess,
        image: url,
        date: new Date(),
      },
    });

    await this.prisma.classification.update({
      where: { id: classificationId },
      data: {
        binVerificationId: binVerification.id,
        isTrue: isSuccess,
      },
    });

    if (isSuccess) {
      await this.prisma.reward.create({
        data: {
          userId: classification.waste.userId,
          classificationId: classificationId,
          points: 10,
          date: new Date(),
        },
      });
    }

    return {
      classificationId,
    };
  }

  private getMostConfidentBin(
    detections: { category: string; confidence: number }[],
  ) {
    if (!detections || detections.length === 0) {
      throw new BadRequestException('No bin detections found');
    }

    return detections.sort((a, b) => b.confidence - a.confidence)[0];
  }

  private getBinName(binCategoryName: string) {
    const binName = CATEGORY_NAME_TO_BIN_NAME[binCategoryName];
    if (!binName) {
      throw new BadRequestException(
        `Bin name not found for category: ${binCategoryName}`,
      );
    }
    return binName;
  }

  async getClassificationResult(id: string) {
    const classification = await this.prisma.classification.findUnique({
      where: { id },
      include: {
        BinVerification: {
          include: {
            predictedBin: {
              select: {
                name: true,
              },
            },
            targetBin: {
              select: {
                name: true,
              },
            },
          },
        },
        wasteCategory: true,
      },
    });

    if (!classification) {
      throw new NotFoundException('Classification not found');
    }

    const reward = await this.prisma.reward.findFirst({
      where: {
        classificationId: id,
      },
    });

    return {
      isSuccess: classification.isTrue ?? false,
      points: reward?.points ?? -1,
      wasteCategory: classification.wasteCategory.name,
      binCategory: classification.BinVerification?.predictedBin.name,
    };
  }
}
