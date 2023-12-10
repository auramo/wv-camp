import { WeConnect, AirConditioningStatus } from './weconnectTypes'
import util from 'node:util'
import childProcess from 'node:child_process'
import { VwCredentials } from './carTypes'

const exec = util.promisify(childProcess.exec)

const climatisationStatusCommand = (
  userName: string,
  password: string,
  VIN: string
) =>
  `weconnect-cli --no-cache --username "${userName}" --password "${password}" get /vehicles/${VIN}/domains/climatisation/climatisationStatus/climatisationState`

const turnOnClimatisationCommand = (
  userName: string,
  password: string,
  VIN: string
) =>
  `weconnect-cli --username "${userName}" --password "${password}" set /vehicles/${VIN}/controls/climatisation start`

async function getAirconditioningStatus(
  credentials: VwCredentials
): Promise<AirConditioningStatus> {
  console.info(`Getting air conditioning status for ${credentials.vin}...`)
  const { stdout } = await exec(
    climatisationStatusCommand(
      credentials.login,
      credentials.password,
      credentials.vin
    )
  )
  const result = stdout.trim()
  console.info(`Got status ${result} for ${credentials.vin}`)
  switch (result) {
    case 'ventilation':
      return 'on'
    case 'off':
      return 'off'
    default:
      console.error(`Got an erroneous response from weconnect ${result}`)
      return null
  }
}

async function startAirConditioning(credentials: VwCredentials): Promise<void> {
  console.info(
    `Sending air conditioning start command for ${credentials.vin}...`
  )
  await exec(
    turnOnClimatisationCommand(
      credentials.login,
      credentials.password,
      credentials.vin
    )
  )
  console.info(`Air conditioning start command sent`)
}

const weConnect: WeConnect = { getAirconditioningStatus, startAirConditioning }

export default weConnect
