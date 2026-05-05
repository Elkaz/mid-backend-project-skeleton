/**
 * @param { import("knex").Knex } knex
 */
export async function up(knex) {
  await knex.schema.createTable("cart", (table) => {
    table.increments("id").primary();

    table
      .integer("user_id")
      .nullable()
      .references("id")
      .inTable("app_user")
      .onDelete("SET NULL");

    table
      .enu("status", ["active", "ordered"])
      .notNullable()
      .defaultTo("active");

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("cart");
}