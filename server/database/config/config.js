const config = {
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dialect: process.env.DATABASE_DIALECT,
  migrationStorage: "sequelize",
  seederStorage: "sequelize",
  benchmark: true,
  logging:
    process.env.DATABASE_LOGGING === "true"
      ? (sql, timing) =>
          console.debug(`${sql.replaceAll(/\s+/g, " ")} +${timing}ms`)
      : false,
};

module.exports = {
  development: config,
  stage: config,
  uat: config,
  production: config,
};
