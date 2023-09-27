

import util from 'node:util'
import childProcess from 'node:child_process'

const exec = util.promisify(childProcess.exec)

const climatisationStatusCommand = (userName: string, password: string, VIN: string) => 
`weconnect-cli --no-cache --username "${userName}" --password "${password}" get /vehicles/${VIN}/domains/climatisation/climatisationStatus/climatisationState`

export async function getVentilationStatus(userName: string, password: string, VIN: string) {
  const { stdout } = await exec(climatisationStatusCommand(userName, password, VIN))
  return stdout.trim()
}
