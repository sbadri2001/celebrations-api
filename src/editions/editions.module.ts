import { Module } from '@nestjs/common';

import { EditionsController } from './editions.controller';
import { EditionsService } from './editions.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EditionsController],
  providers: [EditionsService],
  exports: [EditionsService],
})
export class EditionsModule {}
