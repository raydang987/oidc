import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { UserDto } from "./dto/user.dto";

@ApiTags("Users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: "Lấy danh sách người dùng" })
  async findAll(): Promise<UserDto[]> {
    return await this.userService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Lấy thông tin người dùng" })
  async findOne(@Param("id") id: string): Promise<UserDto> {
    const user = await this.userService.findOneById(id);
    if (!user) throw new NotFoundException("Người dùng không tồn tại!");
    return user;
  }

  @Patch(":id")
  @ApiOperation({ summary: "Cập nhật thông tin người dùng" })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateUserDto
  ): Promise<{ message: string; user: UserDto }> {
    const user = await this.userService.update(id, dto);
    if (!user) throw new NotFoundException("Không tìm thấy người dùng!");
    return { message: "Cập nhật thành công!", user };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Xóa người dùng" })
  async delete(@Param("id") id: string) {
    const success = await this.userService.deleteById(id);
    if (!success) throw new NotFoundException("Người dùng không tồn tại!");
    return { message: "Xóa người dùng thành công!" };
  }
}
