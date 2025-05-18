import { Module } from '@nestjs/common';
import { ClassificationController } from './classification.controller';
import { ClassificationService } from './classification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Token } from 'src/common/token';
import { Cookie } from 'src/common/cookie';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ClassificationController],
  providers: [ClassificationService, PrismaService, UserService, Token, Cookie],
  exports: [ClassificationService],
})
export class ClassificationModule {}
