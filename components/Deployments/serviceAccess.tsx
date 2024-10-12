import { ServiceData } from '@/types/dataProvider'

export function formatSSHKeys(keys: string): string {
  if (keys.includes('[]')) {
    keys.replace('[]', '')
  }
  return keys
    .split('\n')
    .map((key) => '"' + key.trim() + '"')
    .join(` `)
}

export function sshUserData(inputSshKey: string) {
  const formattedSSHKeys = formatSSHKeys(inputSshKey)
  const userData: ServiceData = {
    name: 'xnode',
    tags: [],
    specs: { ram: 0, storage: 0 },
    desc: 'Xnode access via SSH',
    nixName: '"xnode"',
    options: [
      {
        name: 'openssh.authorizedKeys.keys',
        nixName: 'openssh.authorizedKeys.keys',
        desc: 'ssh key',
        type: 'list of string',
        value: `[${formattedSSHKeys}]`,
      },
    ],
  }
  return userData
}
