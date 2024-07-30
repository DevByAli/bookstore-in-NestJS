import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
