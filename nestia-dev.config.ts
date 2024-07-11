import type SDK from '@nestia/sdk';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

export const NESTIA_CONFIG: SDK.INestiaConfig = {
  input: async () => {
    const app = await NestFactory.create(AppModule);

    return app;
  },
  output: 'src/api',
  distribute: 'packages/api',
  swagger: {
    output: './swagger.json',
    servers: [
      {
        url: 'http://localhost:3000/v1',
        description: 'Local Server',
      },
    ],
  },
};
export default NESTIA_CONFIG;
