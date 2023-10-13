import { kStringMaxLength } from 'buffer'
import {
  Record,
  Number,
  String,
  Static,
  Boolean,
  InstanceOf,
  Null,
} from 'runtypes'

export const VwCredentials = Record({
  login: String,
  password: String,
  vin: String,
})

export type VwCredentials = Static<typeof VwCredentials>

export const CarStatusInfo = Record({
  vin: String,
  scheduled: Boolean,
  schedulingEnds: InstanceOf(Date).Or(Null),
  ventilationStatusUpdated: InstanceOf(Date).Or(Null),
  ventilationStatus: String.Or(Null),
})

export type CarStatusInfo = Static<typeof CarStatusInfo>