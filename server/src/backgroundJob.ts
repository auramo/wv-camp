import {
  getCarsToUpdate,
  storeLastStatusCall,
  storeVentilationStarted,
} from './CarRepository'
import { VwCredentials } from './carTypes'
import { getAirConditioningStatus, startAirConditioning } from './weconnect'

const INTERVAL_SECONDS = 5000

export function startBackgroundJob() {
  setInterval(doIt, INTERVAL_SECONDS)
}

async function doIt() {
  console.info('Ventilation background job starting', new Date())
  const carsToUpdate = await getCarsToUpdate()
  console.info(
    'cars to update',
    carsToUpdate.map((carCreds) => carCreds.vin)
  )
  const ventilationCommands = carsToUpdate.map((carCreds) =>
    turnVentilationOnIfNecessary(carCreds)
  )
  await Promise.all(ventilationCommands)
  console.info('Ventilation background job round done', new Date())
}

async function turnVentilationOnIfNecessary(carCreds: VwCredentials) {
  const ventilationStatus = await getAirConditioningStatus(
    carCreds.login,
    carCreds.password,
    carCreds.vin
  )
  console.info(
    `Ventilation status for car ${carCreds.vin}: ${ventilationStatus}`
  )
  if (ventilationStatus) {
    await storeLastStatusCall(carCreds.vin, ventilationStatus)
  }
  if (ventilationStatus === 'off') {
    console.info(`Starting ventilation for ${carCreds.vin}`)
    await startAirConditioning(carCreds.login, carCreds.password, carCreds.vin)
    await storeVentilationStarted(carCreds.vin)
    console.info(`Started ventilation for ${carCreds.vin}`)
  }
}
