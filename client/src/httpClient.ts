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
  return response.json() // parses JSON response into native JavaScript objects
}

export async function get(path) {
  console.info('calling api..')
  const response = await fetch(path)
  if (response.status == 200) {
    return await response.json()
  } else {
    console.error(`Error when fetching ${path}, got status ${response.status}`)
    const content = await response.text()
    throw new Error(`Got ${response.status} \n ${content}`)
  }
}
