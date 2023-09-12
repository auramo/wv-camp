import { pool } from "./Database";
import { Record, Number, String } from "runtypes";
import { queryMaybeOne, sql } from "possu";

export async function findUserByLogin(email: string): Promise<string | null> {
  `SELECT id, login, name FROM user_account WHERE LOWER(login) = $1
`;
  const User = Record({
    id: String,
    login: String,
    name: String,
  });
  const user = await queryMaybeOne(
    pool,
    sql`SELECT id, login, name FROM user_account WHERE LOWER(login) = ${email}`,
    User.check
  );
  console.info("Found user", user);
  if (user) return user.login;
  return null;
}

export default { findUserByLogin };
