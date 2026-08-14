import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Controller, Get } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdminsModule } from './modules/admins/admins.module';
import { SuperAdminsModule } from './modules/super-admins/super-admins.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PostsModule } from './modules/posts/posts.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { DaysModule } from './modules/days/days.module';
import { MealsModule } from './modules/meals/meals.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SlipsModule } from './modules/slips/slips.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UploadModule } from './modules/upload/upload.module';
import { MailModule } from './modules/mail/mail.module';

@Controller()
class HealthController {
  @Get()
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AdminsModule,
    SuperAdminsModule,
    PaymentsModule,
    PostsModule,
    ActivitiesModule,
    DaysModule,
    MealsModule,
    NotificationsModule,
    SlipsModule,
    SettingsModule,
    UploadModule,
    MailModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
