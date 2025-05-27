import { Waste } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type WasteWithCategory = Waste & {
  classification?: {
    wasteCategory?: {
      name: string;
    };
  } | null;
};

const countWasteByCategory = (
  wastes: WasteWithCategory[],
): {
  organik: number;
  anorganik: number;
  b3: number;
} => {
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
};

export const calculatePercentage = (value: number, total: number): number => {
  return total === 0 ? 0 : Math.round((value / total) * 100);
};

export const getWasteCountsByTime = async (
  prismaService: PrismaService,
  userId: string,
  referenceDate: Date,
): Promise<{ organik: number; anorganik: number; b3: number }> => {
  const startOfWeek = new Date(referenceDate);
  startOfWeek.setDate(referenceDate.getDate() - referenceDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const wastes = await prismaService.waste.findMany({
    where: {
      userId,
      date: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
    include: {
      Classification: {
        include: {
          wasteCategory: true,
        },
      },
    },
  });

  return countWasteByCategory(wastes);
};
