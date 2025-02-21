import {
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { AuthService } from "../auth/auth.service";
import { User } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginDto } from "../auth/dto/login.dto";
import { UserDto } from "./dto/user.dto";
import { plainToInstance } from "class-transformer";
import { Op } from "sequelize";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService
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

  async create(userDto: CreateUserDto) {
    const user = await this.userModel.create(userDto);
    return user;
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.findAll();
    return users.map((user) =>
      plainToInstance(UserDto, user, { excludeExtraneousValues: true })
    );
  }

  async findOneById(id: string): Promise<UserDto | null> {
    const user = await this.userModel.findByPk(id);
    return user
      ? plainToInstance(UserDto, user, { excludeExtraneousValues: true })
      : null;
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<UserDto | null> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new HttpException("User không tồn tại!", HttpStatus.NOT_FOUND);
    }

    if (updateDto.password) {
      updateDto.password = await this.authService.hashPassword(
        updateDto.password
      );
    }

    await user.update(updateDto);

    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ where: { username } });
  }

  async deleteById(id: string): Promise<boolean> {
    const user = await this.userModel.findByPk(id);
    if (!user) return false;
    await user.destroy();
    return true;
  }

  async updateIdSub(userId: number, id_sub: string) {
    return this.userModel.update({ id_sub }, { where: { id: userId } });
  }

  async register(
    createUserDto: CreateUserDto
  ): Promise<{ message: string; user: User }> {
    const existingUser = await this.userModel.findOne({
      where: {
        [Op.or]: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException("Username đã tồn tại!");
      }
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException("Email đã tồn tại!");
      }
    }

    createUserDto.password = await this.authService.hashPassword(
      createUserDto.password
    );

    const newUser = await this.userModel.create(createUserDto);

    return {
      message: "Đăng ký thành công!",
      user: newUser,
    };
  }

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { username: loginDto.username },
    });

    if (
      user &&
      (await this.authService.comparePasswords(
        loginDto.password,
        user.password
      ))
    ) {
      return user;
    }

    return null;
  }
}
