const INTERVAL_SECONDS = 5000

export function startBackgroundJob() {
  setInterval(
    () => console.info('background job woke' + new Date(), INTERVAL_SECONDS),
    INTERVAL_SECONDS
  )
}
