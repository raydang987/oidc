import { Logger } from "@nestjs/common";
import { colors } from "src/common/colors";

export const sequelizeLogger = (dbName = "Sequelize") => {
  const logger = new Logger(dbName);

  return (sql: string, timing?: number) => {
    logger.debug(
      `${sql.replaceAll(/\s+/g, " ")} ${colors.FgYellow}+${timing}ms`
    );
  };
};
