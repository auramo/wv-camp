import weconnectDummy from './weconnectDummyImplementation'
import weconnectCli from './weconnectCliImplementation'
import { AirConditioningStatus } from './weconnectTypes'

const weConnect =
  process.env.DUMMY_WECONNECT === 'true' ? weconnectDummy : weconnectCli

export async function getAirConditioningStatus(
  userName: string,
  password: string,
  VIN: string
): Promise<AirConditioningStatus> {
  return await weConnect.getAirconditioningStatus({
    login: userName,
    password,
    vin: VIN,
  })
}

export async function startAirConditioning(
  userName: string,
  password: string,
  VIN: string
): Promise<void> {
  await weConnect.startAirConditioning({
    login: userName,
    password,
    vin: VIN,
  })
}
