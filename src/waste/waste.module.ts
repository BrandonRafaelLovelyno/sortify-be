import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';
import { WasteController } from './waste.controller';
import { WasteService } from './waste.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, CommonModule, UserModule],
  controllers: [WasteController],
  providers: [WasteService],
  exports: [WasteService],
})
export class WasteModule {}
