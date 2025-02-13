import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { TerminusModule } from "@nestjs/terminus";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import configuration from "./config/configuration";
import { DatabaseConfig } from "./config/configuration.interface";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get<DatabaseConfig>("database"),
      inject: [ConfigService],
    }),
    TerminusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(AppController);
    consumer.apply(LoggerMiddleware).forRoutes("**");
  }
}
