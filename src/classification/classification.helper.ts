import { Waste } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type WasteWithCategory = Waste & {
  Classification?: {
    wasteCategory?: {
      name: string;
    };
  } | null;
};

export const calculatePercentage = (value: number, total: number): number => {
  return total === 0 ? 0 : Math.round((value / total) * 100);
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
    if (waste.Classification?.wasteCategory) {
      console.log(
        `Waste ID: ${waste.id}, Category: ${waste.Classification.wasteCategory.name}`,
      );
      const category = waste.Classification.wasteCategory.name.toLowerCase();
      if (category.includes('anorganik')) {
        anorganik++;
      } else if (category.includes('organik')) {
        organik++;
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

export const getWasteCountsByTime = async (
  prismaService: PrismaService,
  userId: string,
  referenceDate: Date,
  isPreviousWeek = false,
) => {
  const startOfWeek = new Date(referenceDate);
  if (isPreviousWeek) {
    startOfWeek.setDate(referenceDate.getDate() - referenceDate.getDay() - 7);
  } else {
    startOfWeek.setDate(referenceDate.getDate() - referenceDate.getDay());
  }
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

export const calculateGrowthPercentage = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return parseFloat((((current - previous) / previous) * 100).toFixed(1));
};
