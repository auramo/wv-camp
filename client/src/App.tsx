import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useStatus } from './status'
import { MainView } from './MainView'
import './App.css'
import { Spinner } from './Spinner'

function App() {
  const [status, fetchStatus] = useStatus()
  useEffect(() => {
    fetchStatus()
  }, [])
  return (
    <div className="App">
      <img src="/sporty-beetle2-small.png" />

      {status.loginState === 'loggedOut' ? (
        <Navigate to="/login" replace={true} />
      ) : null}
      {status.loginState === 'loggedIn' ? (
        <MainView status={status} fetchStatus={fetchStatus}></MainView>
      ) : (
        <div className="mainView-spinner">
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default App
