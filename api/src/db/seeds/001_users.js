import bcrypt from "bcrypt";

/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
  await knex("app_user").del();

  const hashedPassword = await bcrypt.hash("test1234", 10);

  await knex("app_user").insert([
    {
      id: 1,
      name: "Ryan Joon",
      email: "Ryan@example.com",
      password: hashedPassword,
    },
    {
      id: 2,
      name: "John John",
      email: "john@example.com",
      password: await bcrypt.hash("john1234", 10),
    },
  ]);
}
