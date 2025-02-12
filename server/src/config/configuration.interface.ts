import { SequelizeModuleOptions } from "@nestjs/sequelize";
export type AppConfig = {
  env: string;
  host: string;
  port: number;
  payloadLimit: string;
};
export interface MinioConfig {
  endpoint: string;
  useSSL: boolean;
  accessKeyId: string;
  secretAccessKey: string;
  port: number;
  bucket: string;
}
export type DatabaseConfig = SequelizeModuleOptions;
export interface ScheduleConfig {
  refreshStatistics: string;
}
