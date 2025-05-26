import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { WasteController } from './waste.controller';
import { WasteService } from './waste.service';
import { UserModule } from '../user/user.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,
    CommonModule,
    UserModule,
    ConfigModule,
    CloudinaryModule,
  ],
  controllers: [WasteController],
  providers: [WasteService],
  exports: [WasteService],
})
export class WasteModule {}
