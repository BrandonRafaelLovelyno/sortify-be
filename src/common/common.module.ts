import { Module } from '@nestjs/common';
import { Token } from './token';

@Module({
  exports: [Token],
  providers: [Token],
})
export class CommonModule {}
