import { VwCredentials } from './carTypes'
import { WeConnect, AirConditioningStatus } from './weconnectTypes'

const carStatuses = new Map<string, Exclude<AirConditioningStatus, undefined>>()

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const simulatedDelayMs = (): number => Math.round(1000 + Math.random() * 1000)

async function simulateDelay() {
  await sleep(simulatedDelayMs())
}

async function getAirconditioningStatus(
  credentials: VwCredentials
): Promise<AirConditioningStatus> {
  console.info(
    `[DUMMY] Getting air conditioning status for ${credentials.vin}...`
  )
  await simulateDelay()
  if (!carStatuses.has(credentials.vin)) {
    carStatuses.set(credentials.vin, 'off')
  }
  const status = carStatuses.get(credentials.vin)
  console.info(`[DUMMY] Got status ${status} for ${credentials.vin}...`)
  return status
}

async function startAirConditioning(credentials: VwCredentials): Promise<void> {
  console.info(
    `[DUMMY] Sending air conditioning start command for ${credentials.vin}...`
  )
  await simulateDelay()
  carStatuses.set(credentials.vin, 'on')
  console.info(`[DUMMY] Air conditioning start command sent`)
}

const weConnect: WeConnect = { getAirconditioningStatus, startAirConditioning }

export default weConnect
