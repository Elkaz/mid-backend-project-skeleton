export function createKnexConfig() {
  const client = process.env.DB_CLIENT ?? "pg";

  const isSqlite = client === "sqlite3";

  return {
    client,

    connection: isSqlite
      ? {
          filename: process.env.DB_SQLITE_FILENAME ?? "src/db/database.sqlite",
        }
      : {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE_NAME,
          ssl:
            process.env.DB_USE_SSL === "true"
              ? { rejectUnauthorized: false }
              : false,

          searchPath: ["public"],
        },

    useNullAsDefault: isSqlite,

    migrations: {
      directory: "src/db/migrations",
    },

    seeds: {
      directory: "src/db/seeds",
    },
  };
}
