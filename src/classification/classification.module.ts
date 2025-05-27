import { Module } from '@nestjs/common';
import { ClassificationController } from './classification.controller';
import { ClassificationService } from './classification.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { Token } from '../common/token';
import { Cookie } from '../common/cookie';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ClassificationController],
  providers: [ClassificationService, PrismaService, UserService, Token, Cookie],
  exports: [ClassificationService],
})
export class ClassificationModule {}
