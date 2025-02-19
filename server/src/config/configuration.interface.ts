import { SequelizeModuleOptions } from "@nestjs/sequelize";
export type AppConfig = {
  env: string;
  host: string;
  port: number;
  payloadLimit: string;
};
export type DatabaseConfig = SequelizeModuleOptions;
export interface ScheduleConfig {
  refreshStatistics: string;
}
