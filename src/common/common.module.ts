import { Module } from '@nestjs/common';
import { Token } from './token';
import { Cookie } from './cookie';

@Module({
  exports: [Token, Cookie],
  providers: [Token, Cookie],
})
export class CommonModule {}
