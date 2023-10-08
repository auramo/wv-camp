import { pool } from './Database'
import { Record, Number, String, Static } from 'runtypes'
import { Transaction, execute, queryMaybeOne, sql } from 'possu'

const WvCredentials = Record({
  login: String,
  vin: String,
})

type User = Static<typeof WvCredentials>

export async function findVwCredentialsByLogin(
  login: string
): Promise<User | null> {
  const user = await queryMaybeOne(
    pool,
    sql`SELECT login, vin FROM wv_credentials WHERE LOWER(login) = ${login}`,
    WvCredentials.check
  )
  console.info('Found user', user)
  if (user) return user
  return null
}

export async function storeVwCredentials(
  login: string,
  password: string,
  vin: string
) {
  await execute(
    pool,
    sql`INSERT INTO vw_credentials (login, password, vin) VALUES (${login}, ${password}, ${vin})
        ON CONFLICT (login) DO UPDATE SET login = ${login}, password = ${password}, vin = ${vin}`
  )
}

export default { findWvCredentialsByLogin: findVwCredentialsByLogin }
