import { handleErrorResponse, post } from './httpClient'
import { LoggedInStatus } from './status'
import { useState } from 'react'

const HOURS = 9

async function startAirConditioning(
  schedule: { hours: number },
  fetchStatus: () => void
) {
  const response = await post('/api/startAirConditioning', schedule)
  if (response.status !== 200) {
    await handleErrorResponse(response)
  }
  fetchStatus()
}

async function stopAirConditioning(fetchStatus: () => void) {
  const response = await post('/api/stopAirConditioning')
  if (response.status !== 200) {
    await handleErrorResponse(response)
  }
  fetchStatus()
}

function getVentilationStatus(ventilationStatus: string): string {
  switch (ventilationStatus) {
    case 'on':
      return 'ON'
    case 'off':
      return 'OFF'
    default:
      return 'UNKNOWN'
  }
}

export function MainView(props: {
  status: LoggedInStatus
  fetchStatus: () => void
}) {
  const acOn = () => props.status.carStatusInfo.ventilationStatus === 'on'
  const schedulingOn = () => props.status.carStatusInfo.scheduled === true
  const [hours, setHours] = useState(3)
  return (
    <div>
      <div style={{ padding: '10px' }}>{props.status.carStatusInfo.vin}</div>
      <div style={{ padding: '10px' }}>
        Ventilation:{' '}
        <span className={acOn() ? 'stateIndicator--on' : 'stateIndicator--off'}>
          {getVentilationStatus(props.status.carStatusInfo.ventilationStatus)}
        </span>
      </div>
      <div style={{ padding: '10px' }}>
        Scheduled:{' '}
        {props.status.carStatusInfo.scheduled ? (
          <span className="stateIndicator--on">ON</span>
        ) : (
          <span className="stateIndicator--off">OFF</span>
        )}
      </div>
      <form className="pure-form">
        {schedulingOn() ? (
          <fieldset>
            <span className="mainViewLabel">Scheduled until</span>
            <button
              type="button"
              className="pure-button pure-button-primary"
              onClick={async () => {
                await stopAirConditioning(props.fetchStatus)
              }}
            >
              Stop
            </button>
          </fieldset>
        ) : (
          <fieldset>
            <select
              id="hours"
              value={hours}
              style={{ marginRight: '5px' }}
              onChange={(evt) => setHours(Number(evt.target.value))}
            >
              {[...Array(HOURS).keys()].map((hourIndex) => {
                const hour = hourIndex + 1
                return (
                  <option key={hourIndex} value={hour}>
                    {hour + ' '} hours
                  </option>
                )
              })}
            </select>
            <button
              type="button"
              className="pure-button pure-button-primary"
              title="Air conditioning or Heating, depends on temperature"
              onClick={async () => {
                await startAirConditioning({ hours }, props.fetchStatus)
              }}
            >
              Start Air Conditioning
            </button>
          </fieldset>
        )}
      </form>
    </div>
  )
}
