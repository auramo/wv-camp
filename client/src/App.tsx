import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import './App.css'
import React from 'react'
import { get, post } from './httpClient'

interface UnknownStatus {
  loginState: 'unknown'
}

interface LoggedOutStatus {
  loginState: 'loggedOut'
}

interface LoggedInStatus {
  loginState: 'loggedIn'
  vin: string
  login: string
  ventilationStatus: string
}

type Status = UnknownStatus | LoggedOutStatus | LoggedInStatus

async function fetchStatus(setStatus: (status: Status) => void) {
  const response = await fetch('/api/status')
  if (response.status === 200) {
    const responseContent = await response.json()
    setStatus({ ...responseContent, loginState: 'loggedIn' })
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

function MainView(props: { status: LoggedInStatus }) {
  return (
    <div>
      <div style={{ padding: '10px' }}>{props.status.login}</div>
      <div style={{ padding: '10px' }}>{props.status.vin}</div>
      <div style={{ padding: '10px' }}>
        Ventilation:{' '}
        <span
          style={{
            background: '#519251',
            color: '#fff',
            padding: '5px',
            borderRadius: '3px',
          }}
        >
          {props.status.ventilationStatus}
        </span>
      </div>
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
