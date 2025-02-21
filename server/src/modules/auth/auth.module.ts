import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../user/entity/user.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    SequelizeModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1h" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
