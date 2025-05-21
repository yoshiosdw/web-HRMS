export default [
  {
    heading: "SETTINGS",
    action: "Manage",
    subject: "Auth",
  },
  {
    title: "Configuration",
    to: { name: 'hrms-settings'},
    icon: { icon: "tabler-settings" },
    action: "Manage",
    subject: "Auth",
  },
  {
    title: 'Authorization',
    icon: { icon: 'tabler:lock' },
    action:'Manage',
    subject:'Auth',
    children: [
      {
        title: 'Permissions',
        to:'hrms-settings-permissions',
        subject:'Dashboard',
        action:'Read',
      },
      {
        title: 'Role',
        to:'hrms-settings-roles',
        subject:'Dashboard',
        action:'Read',
      },
      // {
      //   title: 'User',
      //   to:'hrms-settings-user',
      //   subject:'Dashboard',
      //   action:'Read',
      // },
    ]
  },
];
