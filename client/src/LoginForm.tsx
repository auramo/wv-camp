import React, { useState } from 'react'
import { post } from './httpClient'
import { Navigate } from 'react-router-dom'

async function logIn(
  login: string,
  password: string,
  vin: string
): Promise<LoginStatus> {
  const result = await post('/auth/login', { login, password, vin })
  if (result.status === 200) return { loggedIn: true }
  return { loggedIn: false, responseStatus: result.status }
}

interface LoginFormValues {
  login: string
  password: string
  vin: string
}

interface LoginStatus {
  loggedIn: boolean
  responseStatus?: number
}

export function LoginForm() {
  const [formValues, setFormValue] = useState<LoginFormValues>({
    login: '',
    password: '',
    vin: '',
  })
  const [loginStatus, setLoginStatus] = useState<LoginStatus>({
    loggedIn: false,
  })
  return (
    <div>
      <img src="/sporty-beetle2-small.png" />
      {loginStatus.loggedIn ? <Navigate to="/" replace={true} /> : null}
      {loginStatus.responseStatus ? (
        <span>Login failed with code: {loginStatus.responseStatus}</span>
      ) : null}
      <form className="pure-form pure-form-stacked">
        <fieldset>
          <label htmlFor="login">Email</label>
          <input
            type="email"
            id="login"
            placeholder="Login email"
            value={formValues.login}
            size={30}
            onChange={(evt) =>
              setFormValue({ ...formValues, login: evt.target.value })
            }
          />
          <span className="pure-form-message">This is a required field.</span>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={formValues.password}
            size={30}
            onChange={(evt) =>
              setFormValue({ ...formValues, password: evt.target.value })
            }
          />
          <label htmlFor="vin">VIN</label>
          <input
            type="text"
            id="vin"
            placeholder="VIN code"
            value={formValues.vin}
            size={30}
            onChange={(evt) =>
              setFormValue({ ...formValues, vin: evt.target.value })
            }
          />
          <button
            type="button"
            style={{ marginTop: '10px' }}
            className="pure-button pure-button-primary"
            onClick={async () => {
              const result = await logIn(
                formValues.login,
                formValues.password,
                formValues.vin
              )
              setLoginStatus(result)
            }}
          >
            Sign in
          </button>
        </fieldset>
      </form>
    </div>
  )
}
