import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import * as compression from "compression";
import { json, urlencoded } from "express";
import * as momentTimezone from "moment-timezone";
import * as pg from "pg";
import "source-map-support/register";
import { AppModule } from "./app.module";
import { useSwagger } from "./common/swagger";
import { AppConfig } from "./config/configuration.interface";
import { DefaultResponseInterceptor } from "./interceptors/default-response.interceptor";
import { PostInterceptor } from "./interceptors/post.interceptor";

momentTimezone.tz.setDefault(process.env.TZ);
pg.defaults.parseInt8 = true;

async function bootstrap() {
  const logger = new Logger("Application", { timestamp: true });
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>("app");

  app.use(urlencoded({ extended: true, limit: appConfig.payloadLimit }));
  app.use(json({ limit: appConfig.payloadLimit }));
  app.use(compression());

  app.setGlobalPrefix("api", { exclude: ["", "health"] });
  app.useGlobalInterceptors(
    new PostInterceptor(),
    new DefaultResponseInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector), {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
      excludePrefixes: ["_"],
    })
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      stopAtFirstError: true,
    })
  );

  useSwagger(app);
  app.enableCors();
  await app.listen(appConfig.port, appConfig.host, async () => {
    logger.log(`is running on: ${await app.getUrl()} [${appConfig.env}]`);
  });
}
bootstrap();
