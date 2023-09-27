import { useState } from 'react'
import { Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import './App.css'
import React from 'react'

const callApi = async () => {
  console.info('calling api..')
  const response = await fetch('/api/getVentilationStatus')
  if (response.status == 200) {
    console.info('Got response:')
    console.info(await response.json())
  } else {
    console.info('Got status: ', response.status)
  }
}

function App() {
  const [count, setCount] = useState(0)
  const [apiResult, setApiResult] = useState<string | null>(null)
  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={callApi}>Call API</button>
        {apiResult ? <div> {apiResult} </div> : null}
      </div>
      <Link to={`other`}>Go to other route</Link>
    </div>
  )
}

export default App
