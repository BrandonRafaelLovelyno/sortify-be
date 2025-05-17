import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';
import { WasteController } from './waste.controller';
import { WasteService } from './waste.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, CommonModule, UserModule, ConfigModule],
  controllers: [WasteController],
  providers: [WasteService],
  exports: [WasteService],
})
export class WasteModule {}
