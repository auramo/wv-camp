import { pool } from './Database'
import { execute, queryMaybeOne, query, sql } from 'possu'
import {
  CarStatusInfo,
  VwCredentials,
  VentilationStatus,
  CarSchedulingStatus,
} from './carTypes'
import { AirConditioningStatus } from './weconnectTypes'

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

export async function clearVentilationSchedule(login: string): Promise<void> {
  await execute(
    pool,
    sql`UPDATE car SET ventilate_until = NULL
    WHERE LOWER(login) = ${login}`
  )
}

export async function storeVentilationStarted(vin: string): Promise<void> {
  await execute(
    pool,
    sql`UPDATE car SET last_start_cmd = now()
        WHERE vin = ${vin}`
  )
}

export async function storeLastStatusCall(
  vin: string,
  status: AirConditioningStatus
): Promise<void> {
  await execute(
    pool,
    sql`UPDATE car 
        SET last_status_call = now(),
            ventilation_status = ${status}
        WHERE vin = ${vin}`
  )
}

export async function getStoredVentilationStatus(
  login: string
): Promise<VentilationStatus | undefined> {
  const carStatusInfo = await queryMaybeOne(
    pool,
    sql`SELECT
        ventilation_status AS "ventilationStatus",
        last_status_call AS "ventilationStatusUpdated"
        FROM car WHERE LOWER(login) = ${login}`,
    VentilationStatus.check
  )
  return carStatusInfo
}

export async function getCarSchedulingStatus(
  login: string
): Promise<CarSchedulingStatus | undefined> {
  const schedulingStatus = await queryMaybeOne(
    pool,
    // We'll throw the vin here 'for good measure' so we don't have to
    // fetch it in a separate query
    sql`SELECT vin, 
        ventilate_until AS "schedulingEnds",
        COALESCE(ventilate_until >= now(), FALSE) AS "scheduled"
        FROM car WHERE LOWER(login) = ${login}`,
    CarSchedulingStatus.check
  )
  return schedulingStatus
}

export async function getCarStatusInfo(
  login: string
): Promise<CarStatusInfo | undefined> {
  const carStatusInfo = await queryMaybeOne(
    pool,
    sql`SELECT vin, 
        ventilation_status AS "ventilationStatus",
        last_status_call AS "ventilationStatusUpdated",
        ventilate_until AS "schedulingEnds",
        COALESCE(ventilate_until >= now(), FALSE) AS "scheduled"
        FROM car WHERE LOWER(login) = ${login}`,
    CarStatusInfo.check
  )
  return carStatusInfo
}

export async function getCarsToUpdate(): Promise<VwCredentials[]> {
  const carsToUpdate = await query(
    pool,
    sql`SELECT vin, login, password 
        FROM car 
        WHERE COALESCE(last_status_call, '1970-01-01') <= NOW() - INTERVAL '5 minutes' 
        AND COALESCE(last_start_cmd, '1970-01-01') <= NOW() - INTERVAL '5 minutes' 
        AND ventilate_until >= NOW() + INTERVAL '5 minutes'`,
    VwCredentials.check
  )
  return carsToUpdate
}

//select ventilate_until <= now() from car;
