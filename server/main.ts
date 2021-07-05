import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';
import * as helmet from 'helmet';
import * as hpp from 'hpp';

async function bootstrap() {
  const { KEY_FILE = 'localhost-key.pem', CERT_FILE = 'localhost.pem' } = process.env;

  let keyFile: string;
  let certFile: string;

  try {
    keyFile = fs.readFileSync(path.resolve(__dirname, KEY_FILE), 'utf8');
    certFile = fs.readFileSync(path.resolve(__dirname, CERT_FILE), 'utf8');
  } catch (e) { }

  const httpsOptions =
    keyFile && certFile
      ? {
        key: keyFile,
        cert: certFile,
      }
      : undefined;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
    httpsOptions,
  });

  const configService = app.get<ConfigService>(ConfigService);
  app.useStaticAssets(path.join(__dirname, 'static'));

  app.use(helmet());
  app.use(hpp());
  app.enableCors();

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  const APP_ROUTE_PREFIX = configService.get<string>('APP_ROUTE_PREFIX');
  const APP_API_VERSION = configService.get<string>('APP_API_VERSION');
  const APP_PORT = configService.get<number>('APP_PORT');

  app.setGlobalPrefix(APP_ROUTE_PREFIX);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, disableErrorMessages: false }));

  const options = new DocumentBuilder()
    .addBearerAuth()
    .addBasicAuth()
    .setTitle('TITLE')
    .setDescription('DESCRIPTION')
    .setVersion(`v${APP_API_VERSION}`)
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    // ignoreGlobalPrefix: true, // if enabled - test request in swagger are targeted to striped path and hance not work properly
    // include: [
    //   UserModule,
    // ],
  });

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(APP_PORT);
}
bootstrap();
