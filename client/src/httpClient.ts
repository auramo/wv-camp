export async function post(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  })
  return {
    status: response.status,
    body: await response.json(),
  }
}

export async function get(path: string) {
  console.info('calling api..')
  const response = await fetch(path)
  return await response.json()
}
