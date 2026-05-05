/**
 * @param { import("knex").Knex } knex
 */
export async function up(knex) {
  await knex.schema.createTable("order_item", (table) => {
    table.increments("id").primary();

    table
      .integer("order_id")
      .notNullable()
      .references("id")
      .inTable("customer_order")
      .onDelete("CASCADE");

    table.integer("event_id").notNullable().references("id").inTable("event");

    table.integer("quantity").notNullable();

    table.decimal("price_at_purchase", 10, 2).notNullable();

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("order_item");
}
