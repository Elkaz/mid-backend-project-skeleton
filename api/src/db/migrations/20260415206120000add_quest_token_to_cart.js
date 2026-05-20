export async function up(knex) {
  await knex.schema.alterTable("cart", (table) => {
    table.string("guest_token").nullable().unique();
  });
}

export async function down(knex) {
  await knex.schema.alterTable("cart", (table) => {
    table.dropColumn("guest_token");
  });
}
