/**
 * @param { import("knex").Knex } knex
 */
export async function up(knex) {
  await knex.schema.createTable("customer_order", (table) => {
    table.increments("id").primary();

    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("app_user")
      .onDelete("CASCADE");

    table.decimal("total_price", 10, 2).notNullable();

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("customer_order");
}
