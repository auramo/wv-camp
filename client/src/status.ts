import { useState } from 'react'
import { handleErrorResponse } from './httpClient'

export interface UnknownStatus {
  loginState: 'unknown'
}

export interface LoggedOutStatus {
  loginState: 'loggedOut'
}

export interface LoggedInStatus {
  loginState: 'loggedIn'
  carStatusInfo: any
}

export type Status = UnknownStatus | LoggedOutStatus | LoggedInStatus

export function useStatus(): [Status, () => void] {
  const [status, setStatus] = useState<Status>({ loginState: 'unknown' })

  async function fetchStatus() {
    try {
      const response = await fetch('/api/status')
      if (response.status === 200) {
        const responseContent = await response.json()
        setStatus({ carStatusInfo: responseContent, loginState: 'loggedIn' })
      } else if (response.status === 401) {
        setStatus({ loginState: 'loggedOut' })
      } else {
        await handleErrorResponse(response)
      }
    } catch (e) {
      console.error(e)
      alert(`Error occurred while fetching status ${e}`)
    }
  }
  return [status, fetchStatus]
}
