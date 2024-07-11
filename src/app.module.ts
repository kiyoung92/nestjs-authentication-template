import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? './env/.env.development'
          : './env/.env.production',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
