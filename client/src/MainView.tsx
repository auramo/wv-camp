import { handleErrorResponse, post } from './httpClient'
import { LoggedInStatus } from './status'
import { useState } from 'react'

const HOURS = 9

async function storeSchedule(schedule: { hours: number }) {
  const response = await post('/api/schedule', schedule)
  if (response.status !== 200) {
    await handleErrorResponse(response)
  }
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
  console.info(props.status)
  const [hours, setHours] = useState(3)
  return (
    <div>
      <div style={{ padding: '10px' }}>{props.status.carStatusInfo.vin}</div>
      <div style={{ padding: '10px' }}>
        Ventilation:{' '}
        <span
          className={
            props.status.carStatusInfo.ventilationStatus === 'on'
              ? 'stateIndicator--on'
              : 'stateIndicator--off'
          }
        >
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
            onClick={async () => {
              await storeSchedule({ hours })
            }}
          >
            Schedule
          </button>
        </fieldset>
      </form>
    </div>
  )
}
