export const opensshConfig = {
  nixName: 'openssh',
  options: [
    { nixName: 'enable', type: 'boolean', value: 'true' },
    {
      nixName: 'settings.PasswordAuthentication',
      value: 'false',
      type: 'boolean',
    },
    {
      nixName: 'settings.KbdInteractiveAuthentication',
      value: 'false',
      type: 'boolean',
    },
  ],
}
