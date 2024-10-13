export const opensshConfig = {
  name: 'OpenSSH',
  desc: 'Secure shell server',
  nixName: 'openssh',
  tags: ['ssh', 'server'],
  options: [
    {
      name: 'enable',
      desc: 'Enable OpenSSH server',
      nixName: 'enable',
      type: 'boolean',
      value: 'true',
    },
    {
      name: 'Password Authentication',
      desc: 'Allow password authentication for users',
      nixName: 'settings.PasswordAuthentication',
      value: 'false',
      type: 'boolean',
    },
    {
      name: 'KbdInteractive Authentication',
      desc: 'Allow keyboard-interactive authentication for users',
      nixName: 'settings.KbdInteractiveAuthentication',
      value: 'false',
      type: 'boolean',
    },
  ],
}
