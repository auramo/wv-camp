import { kStringMaxLength } from 'buffer'
import {
  Record,
  Number,
  String,
  Static,
  Boolean,
  InstanceOf,
  Null,
  Union,
  Literal,
} from 'runtypes'

export const VwCredentials = Record({
  login: String,
  password: String,
  vin: String,
})

export type VwCredentials = Static<typeof VwCredentials>

export const VentilationStatus = Record({
  ventilationStatusUpdated: InstanceOf(Date).Or(Null),
  ventilationStatus: Union(Literal('on'), Literal('off')).Or(Null),
})

export type VentilationStatus = Static<typeof VentilationStatus>

export const CarSchedulingStatus = Record({
  vin: String,
  scheduled: Boolean,
  schedulingEnds: InstanceOf(Date).Or(Null),
})

export type CarSchedulingStatus = Static<typeof CarSchedulingStatus>

export const CarStatusInfo = Record({
  vin: String,
  scheduled: Boolean,
  schedulingEnds: InstanceOf(Date).Or(Null),
  ventilationStatus: Union(Literal('on'), Literal('off')).Or(Null),
})

export type CarStatusInfo = Static<typeof CarStatusInfo>
