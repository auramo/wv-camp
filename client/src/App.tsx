import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import './App.css'
import React from 'react'
import { get, post } from './httpClient'

const HOURS = 9

interface UnknownStatus {
  loginState: 'unknown'
}

interface LoggedOutStatus {
  loginState: 'loggedOut'
}

interface LoggedInStatus {
  loginState: 'loggedIn'
  carStatusInfo: any
}

type Status = UnknownStatus | LoggedOutStatus | LoggedInStatus

async function fetchStatus(setStatus: (status: Status) => void) {
  const response = await fetch('/api/status')
  if (response.status === 200) {
    const responseContent = await response.json()
    setStatus({ carStatusInfo: responseContent, loginState: 'loggedIn' })
  } else if (response.status === 401) {
    setStatus({ loginState: 'loggedOut' })
  } else {
    const responseText = await response.text()
    console.error(
      'Error while fetching status',
      response.status,
      await response.text()
    )
    alert(`${response.status}: ${responseText}`)
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

function MainView(props: { status: LoggedInStatus }) {
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
              await post('/api/schedule', { hours })
              console.info('schedule changed')
            }}
          >
            Schedule
          </button>
        </fieldset>
      </form>
    </div>
  )
}

function App() {
  const [status, setStatus] = useState<Status>({ loginState: 'unknown' })
  useEffect(() => {
    fetchStatus(setStatus)
  }, [])
  return (
    <div className="App">
      <img src="/sporty-beetle2-small.png" />

      {status.loginState === 'loggedOut' ? (
        <Navigate to="/login" replace={true} />
      ) : null}
      {status.loginState === 'loggedIn' ? (
        <MainView status={status}></MainView>
      ) : null}
    </div>
  )
}

export default App
