export default [
  {
    heading: "Master",
    action: "Read",
    subject: "Role",
  },
  {
    title: "Partner",
    icon: { icon: "material-symbols:warehouse-outline" },
    action: "Read",
    subject: "Role",
    to: { name: "organization" },
  },
  {
    title: "Rute",
    icon: { icon: "gravity-ui:route" },
    action: "Read",
    subject: "Role",
    to: { name: "routes" },
  },
  {
    title: "Customer",
    icon: { icon: "tabler:users" },
    action: "Read",
    subject: "Role",
    children: [
      {
        title: "Customer",
        action: "Read",
        subject: "Role",
      },
      {
        title: "Agreement",
        action: "Read",
        subject: "Role",
      },
    ],
  },

  {
    title: "Truck",
    icon: { icon: "mdi:truck-outline" },
    action: "Read",
    subject: "Role",
    to: { name: "truck" },
  },
];
  