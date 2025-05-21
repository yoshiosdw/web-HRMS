export default [
  {
    heading: "Warehouse",
    action: "Read",
    subject: "Role",
  },
  {
    title: "Inbound Order",
    icon: { icon: "material-symbols:forklift-outline" },
    action: "Read",
    subject: "Role",
  },
  {
    title: "Movement",
    icon: { icon: "carbon:movement" },
    action: "Read",
    subject: "Role",
  },
  {
    title: "Outbonds",
    icon: { icon: "tabler:truck-loading" },
    action: "Read",
    subject: "Role",
    children: [
      {
        title: "Outbonds Order",
        action: "Read",
        subject: "Role",
      },
      {
        title: "Picking",
        action: "Read",
        subject: "Role",
      },
      {
        title: "Loading",
        action: "Read",
        subject: "Role",
      },
    ],
  },
];
  