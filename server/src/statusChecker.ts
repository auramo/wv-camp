import { getAirConditioningStatus as weConnectAirConditioningStatus } from './weconnect'
import {
  storeLastStatusCall,
  storeVwCredentials,
  getStoredVentilationStatus,
  getCarSchedulingStatus,
  findVwCredentialsByLogin,
} from './CarRepository'
import { CarStatusInfo, VwCredentials } from './carTypes'
import { AirConditioningStatus } from './weconnectTypes'

const FRESH_STATUS_MS_LIMIT = 60_000

interface CheckAirConditioningOpts {
  storeCredentials: boolean
  checkDbFirst: boolean
}

const defaultOpts: CheckAirConditioningOpts = {
  storeCredentials: false,
  checkDbFirst: true,
}

// Wrapper function for getting the airconditioning status by first checking if there is a fresh value in DB
// Also stores credentials if caller so desires
export async function getAirConditioningStatus(
  credentials: VwCredentials,
  opts: CheckAirConditioningOpts = defaultOpts
): Promise<AirConditioningStatus> {
  if (opts.checkDbFirst) {
    const storedStatus = await getStoredVentilationStatus(credentials.login)
    if (
      storedStatus?.ventilationStatusUpdated &&
      storedStatus?.ventilationStatus &&
      new Date().getTime() - storedStatus.ventilationStatusUpdated.getTime() <
        FRESH_STATUS_MS_LIMIT
    ) {
      console.info('Returning DB-cached ventilation status')
      return storedStatus.ventilationStatus
    }
  }
  console.info('Getting the ventilation status from weconnect')
  const ventilationStatus = await weConnectAirConditioningStatus(
    credentials.login,
    credentials.password,
    credentials.vin
  )
  if (opts.storeCredentials) {
    await storeVwCredentials(
      credentials.login,
      credentials.password,
      credentials.vin
    )
  }
  if (ventilationStatus) {
    await storeLastStatusCall(credentials.vin, ventilationStatus)
  }
  return ventilationStatus
}

export async function getCarStatusInfo(
  login: string
): Promise<CarStatusInfo | undefined> {
  const credentials = await findVwCredentialsByLogin(login)
  if (!credentials) {
    console.error(`Could not find credentials with login ${login}`)
    return undefined
  }
  const airconditioningStatus = await getAirConditioningStatus(credentials)
  const schedulingStatus = await getCarSchedulingStatus(login)
  if (schedulingStatus) {
    return { ventilationStatus: airconditioningStatus, ...schedulingStatus }
  }
  return undefined
}
