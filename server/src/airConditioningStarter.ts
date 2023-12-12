import {
  findVwCredentialsByLogin,
  storeVentilationSchedule,
  storeVentilationStarted,
} from './CarRepository'
import { getAirConditioningStatus } from './statusChecker'
import { startAirConditioning as weConnectStartAc } from './weconnect'

export async function startAirConditioning(login: string, hours: number) {
  const credentials = await findVwCredentialsByLogin(login)
  if (!credentials) {
    console.error(`Could not find credentials with login ${login}`)
    return
  }

  console.info(`Starting air conditioning for ${credentials.vin}`)
  await weConnectStartAc(
    credentials.login,
    credentials.password,
    credentials.vin
  )

  // Call this get just for the side-effect of storing the latest status
  // to DB (we assume after successful call to start the air conditioning,
  // we'll get the up-to-date response)
  const status = await getAirConditioningStatus(credentials, {
    checkDbFirst: false,
    storeCredentials: false,
  })

  console.info(
    `Got status ${status} for ${credentials.vin} after starting air conditioning`
  )
  // Store the schedule last so we don't accidentally cause a race condition
  // with the background job
  await storeVentilationSchedule(login, hours)
  await storeVentilationStarted(credentials.vin)
}
