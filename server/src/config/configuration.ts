import { Dialect } from "sequelize";
import { sequelizeLogger } from "src/common/sequelize-logger";
import { AppConfig, DatabaseConfig } from "./configuration.interface";

export default () => {
  const app: AppConfig = {
    env: process.env.NODE_ENV || "development",
    host: process.env.HOST || "localhost",
    port: parseInt(process.env.PORT) || 3001,
    payloadLimit: process.env.PAYLOAD_LIMIT,
  };

  const database: DatabaseConfig = {
    dialect: process.env.DATABASE_DIALECT as Dialect,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    logging:
      process.env.DATABASE_LOGGING === "true"
        ? sequelizeLogger(process.env.DATABASE_DATABASE)
        : false,
    logQueryParameters: true,
    define: { whereMergeStrategy: "and" },
    benchmark: true,
    autoLoadModels: true,
    synchronize: false,
  };

  const timeOtpExpire: number = parseInt(process.env.TIME_OTP_EXPIRE) || 3600;

  return {
    app: app,
    database: database,
    timeOtpExpire: timeOtpExpire,
  };
};
