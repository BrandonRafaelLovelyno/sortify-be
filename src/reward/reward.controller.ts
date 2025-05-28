import { Controller, Get, Param, Req } from '@nestjs/common';
import { RewardService } from './reward.service';
import { Request } from 'express';
import { Cookie } from '../common/cookie';

@Controller('reward')
export class RewardController {
  constructor(
    private readonly rewardService: RewardService,
    private readonly cookie: Cookie,
  ) {}

  @Get('mine')
  async getMyRewards(@Req() request: Request) {
    const token = this.cookie.getCookie(request, 'auth_token');
    return await this.rewardService.getUserRewards(token);
  }
}
