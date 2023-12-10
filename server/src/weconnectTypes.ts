import { VwCredentials } from './carTypes'

export type AirConditioningStatus = 'on' | 'off' | undefined

export interface WeConnect {
  getAirconditioningStatus: (
    credentials: VwCredentials
  ) => Promise<AirConditioningStatus>

  startAirConditioning: (credentials: VwCredentials) => Promise<void>
}
