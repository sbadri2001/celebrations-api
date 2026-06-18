import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { TeamsModule } from './teams/teams.module';
import { MediaModule } from './media/media.module';
import { ResultsModule } from './results/results.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { PrismaModule } from './prisma/prisma.module';
import { EditionsModule } from './editions/editions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    EventsModule,
    TeamsModule,
    MediaModule,
    ResultsModule,
    LeaderboardModule,
    PrismaModule,
    EditionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
