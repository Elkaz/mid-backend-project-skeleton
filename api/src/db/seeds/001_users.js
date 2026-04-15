
export async function seed(knex) {
  await knex("user").del();

  await knex("user").insert([
    {
      id: 1,
      email: "test@example.com",
      password_hash: "hashedpassword",
    },
  ]);
}
