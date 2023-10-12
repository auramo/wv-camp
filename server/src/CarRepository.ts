import { pool } from './Database'
import { Record, Number, String, Static } from 'runtypes'
import { Transaction, execute, queryMaybeOne, sql } from 'possu'

const VwCredentials = Record({
  login: String,
  password: String,
  vin: String,
})

type VwCredentials = Static<typeof VwCredentials>

export async function findVwCredentialsByLogin(
  login: string
): Promise<VwCredentials | null> {
  const user = await queryMaybeOne(
    pool,
    sql`SELECT login, password, vin FROM car WHERE LOWER(login) = ${login}`,
    VwCredentials.check
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
    sql`INSERT INTO car (login, password, vin) VALUES (${login}, ${password}, ${vin})
        ON CONFLICT (login) DO UPDATE SET login = ${login}, password = ${password}, vin = ${vin}`
  )
}

export async function storeVentilationSchedule(
  login: string,
  hours: number
): Promise<void> {
  await execute(
    pool,
    sql`UPDATE car SET ventilate_until = now() + make_interval(hours => ${hours})
    WHERE LOWER(login) = ${login}`
  )
}
