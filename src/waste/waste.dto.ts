import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsObject,
} from '@nestjs/class-validator';

export class WeeklyWasteResult {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  week: string;

  @IsArray()
  wasteItems: any[];

  @IsNumber()
  totalWeight: number;
}

export class WeeklyProgressCount {
  @IsNumber()
  organik: number;

  @IsNumber()
  anorganik: number;

  @IsNumber()
  b3: number;
}

export class WeeklyProgressPercentage {
  @IsNumber()
  organik: number;

  @IsNumber()
  anorganik: number;

  @IsNumber()
  b3: number;
}

export class WeeklyProgressResult {
  @IsObject()
  count: WeeklyProgressCount;

  @IsObject()
  percentage: WeeklyProgressPercentage;
}

export interface ClassificationResult {
  prediction: string;
  confidence: number;
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}
