/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
  await knex.schema.createTable("event", (t) => {
    t.increments("id").primary();
    t.string("title").notNullable();
    t.text("description");
    t.date("date").notNullable();
    t.time("time").notNullable();
    t.string("venue").notNullable();
    t.decimal("price", 10, 2).notNullable();
    t.string("currency", 3).notNullable();
    t.integer("ticket_capacity").notNullable();
    t.timestamps(true, true);
  });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("event");
}
