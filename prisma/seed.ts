import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const USER_ID = '6820b99fe43f06e0e2809e85';

// Predefined IDs for trash bins
const TRASH_BIN_IDS = [
  '681b92031eba62e6f9a56ec3', // organik
  '681b92191eba62e6f9a56ec4', // anorganik
  '681b92401eba62e6f9a56ec5', // b3
];

async function main() {
  console.log('Starting seeding process...');

  console.log('Seeding WasteCategories...');
  const wasteCategories = await seedWasteCategories();

  console.log('Seeding Wastes...');
  const wastes = await seedWastes();

  console.log('Seeding Classifications...');
  const classifications = await seedClassifications(wastes, wasteCategories);

  console.log('Seeding BinVerifications...');
  await seedBinVerifications(classifications);

  console.log('Seeding Rewards...');
  await seedRewards(15);

  console.log('Seeding completed successfully!');
}

async function seedWasteCategories() {
  const wasteCategories: any[] = [];

  const categoryNames = ['Organik', 'Anorganik', 'B3'];
  const descriptions = [
    'Biodegradable waste that can be composted',
    'Non-biodegradable waste like plastic and metal',
    'Hazardous, toxic and harmful waste',
  ];

  // Create one waste category for each trash bin
  for (let i = 0; i < TRASH_BIN_IDS.length; i++) {
    const binId = TRASH_BIN_IDS[i];
    const category = await prisma.wasteCategory.create({
      data: {
        binId: binId,
        name: categoryNames[i],
        description: descriptions[i],
        image: faker.image.url(),
      },
    });

    console.log(`Created waste category: ${category.id} (${category.name})`);
    wasteCategories.push(category);
  }

  return wasteCategories;
}

async function seedWastes() {
  const wastes: any[] = [];
  // Create 30 wastes
  for (let i = 0; i < 30; i++) {
    const waste = await prisma.waste.create({
      data: {
        userId: USER_ID,
        image: faker.image.url(),
        date: faker.date.recent(),
      },
    });
    console.log(`Created waste: ${waste.id}`);
    wastes.push(waste);
  }
  return wastes;
}

async function seedClassifications(wastes: any[], wasteCategories: any[]) {
  const classifications: any[] = [];

  for (let i = 0; i < wastes.length; i++) {
    const waste = wastes[i];
    // Distribute classifications evenly across waste categories
    const wasteCategoryId = wasteCategories[i % wasteCategories.length].id;

    const classification = await prisma.classification.create({
      data: {
        wasteId: waste.id,
        wasteCategoryId,
        isTrue: faker.datatype.boolean(),
      },
    });

    console.log(`Created classification: ${classification.id}`);
    classifications.push(classification);
  }

  return classifications;
}

async function seedBinVerifications(classifications: any[]) {
  for (let i = 0; i < classifications.length; i++) {
    const classification = classifications[i];
    const predictedBinId = TRASH_BIN_IDS[i % TRASH_BIN_IDS.length];
    const photoBinId = TRASH_BIN_IDS[(i + 1) % TRASH_BIN_IDS.length]; // Use a different bin for photo verification

    const binVerification = await prisma.binVerification.create({
      data: {
        predictedBinId,
        photoBinId,
        classificationId: classification.id,
        image: faker.image.url(),
        status: faker.helpers.arrayElement(['Verified', 'Pending', 'Rejected']),
        date: faker.date.recent(),
      },
    });

    // Update the classification with the binVerificationId
    await prisma.classification.update({
      where: { id: classification.id },
      data: { binVerificationId: binVerification.id },
    });

    console.log(`Created binVerification: ${binVerification.id}`);
  }
}

async function seedRewards(count: number) {
  for (let i = 0; i < count; i++) {
    const reward = await prisma.reward.create({
      data: {
        userId: USER_ID,
        points: faker.number.int({ min: 5, max: 100 }),
        date: faker.date.recent(),
      },
    });
    console.log(`Created reward: ${reward.id}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
