import { pool } from './Database'
import { execute, queryMaybeOne, sql } from 'possu'
import { CarStatusInfo, VwCredentials } from './carTypes'

export async function findVwCredentialsByLogin(
  login: string
): Promise<VwCredentials | undefined> {
  const user = await queryMaybeOne(
    pool,
    sql`SELECT login, password, vin FROM car WHERE LOWER(login) = ${login}`,
    VwCredentials.check
  )
  return user
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

export async function getCarStatusInfo(
  login: string
): Promise<CarStatusInfo | undefined> {
  const carStatusInfo = await queryMaybeOne(
    pool,
    sql`SELECT vin, 
        ventilation_status AS "ventilationStatus",
        last_status_call AS "ventilationStatusUpdated" ,
        ventilate_until AS "schedulingEnds",
        COALESCE(ventilate_until <= now(), FALSE) AS "scheduled"
        FROM car WHERE LOWER(login) = ${login}`,
    CarStatusInfo.check
  )
  return carStatusInfo
}

//select ventilate_until <= now() from car;
