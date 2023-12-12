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
  return response
}

export async function get(path: string) {
  console.info('calling api..')
  const response = await fetch(path)
  return await response.json()
}

export async function handleErrorResponse(response: Response) {
  const responseText = await response.text()
  console.error(
    'Error while fetching status',
    response.status,
    await response.text()
  )
  alert(`${response.status}: ${responseText}`)
}
