import { VwCredentials } from './carTypes'

export type AirConditioningStatus = 'on' | 'off' | null

export interface WeConnect {
  getAirconditioningStatus: (
    credentials: VwCredentials
  ) => Promise<AirConditioningStatus>

  startAirConditioning: (credentials: VwCredentials) => Promise<void>
}
