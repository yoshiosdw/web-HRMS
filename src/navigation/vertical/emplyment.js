export default [
  {
    heading: "Master",
    action: "Read",
    subject: "Auth",
  },
  {
    title: "Employee",
    icon: { icon: "tabler:users-group" },
    action: "Read",
    subject: "Employee",
    to: { name: "hrms-employee" },

  },
  {
    title: "Permit",
    icon: { icon: "tabler:folder-check" },
    action: "Read",
    subject: "Permit",
    to: { name: "hrms-permit" },
  },
  {
    title: "Salary",
    icon: { icon: "tabler:currency-dollar" },
    action: "Read",
    subject: "Auth",
        children: [
      {
        title: 'Upload Salary',
        subject: 'Salary',
        action: 'Manage',
        to: { name: 'hrms-salary-summary' },

      },
      {
        title: 'My Salary',
        subject: 'Salary',
        action: 'Read',
        to: { name: 'hrms-salary-user' },
      },
    ],
  },
];
  