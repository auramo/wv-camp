import { getCarsToUpdate } from './CarRepository'

const INTERVAL_SECONDS = 5000

export function startBackgroundJob() {
  setInterval(doIt, INTERVAL_SECONDS)
}

async function doIt() {
  console.info('background job woke' + new Date())
  console.info('### cars to update', await getCarsToUpdate())
}
