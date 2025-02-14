import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { AuthService } from "../auth/auth.service";
import { User } from "./entity/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly authService: AuthService
  ) {}

  async findOrCreateUser(access_token: string): Promise<User> {
    try {
      const userInfo = await this.authService.verifyToken(access_token);

      const existingUser = await this.userModel.findOne({
        where: { email: userInfo.email },
      });

      if (existingUser && existingUser.id_sub !== userInfo.sub) {
        throw new HttpException("Email đã được sử dụng!", HttpStatus.CONFLICT);
      }

      const [user, created] = await this.userModel.findOrCreate({
        where: { id_sub: userInfo.sub },
        defaults: {
          id_sub: userInfo.sub,
          name: userInfo.name || userInfo.preferred_username,
          username: userInfo.preferred_username,
          email: userInfo.email,
          password: null,
        },
      });

      if (!created) {
        console.log("✅ User đã tồn tại.");
      } else {
        console.log("🆕 User mới đã được tạo.");
      }

      return user;
    } catch (error) {
      console.error("❌ Lỗi khi tạo user:", error);
      console.error(
        "Lỗi Sequelize:",
        error.errors?.map((e) => e.message)
      );
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new HttpException("Email đã được sử dụng!", HttpStatus.CONFLICT);
      }
    }
  }
}
