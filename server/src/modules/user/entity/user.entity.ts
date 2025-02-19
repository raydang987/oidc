import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

@Table({ tableName: "t_user", timestamps: false })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  id_sub: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
  })
  sdt: string;
}
