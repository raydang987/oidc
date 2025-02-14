import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { UserService } from "../user/user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../user/entity/user.entity";

@Module({
  imports: [HttpModule, ConfigModule, SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
