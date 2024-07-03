export const columns = [
  {
    key: "name",
    text: "שם",
    className: "nameTR",
    align: "center",
    type: "text",
    sortable: true,
    hidden: false,
    required: true,
  },
  {
    key: "phone",
    text: "טלפון",
    className: "phoneTR",
    align: "center",
    type: "number",
    sortable: true,
    hidden: false,
    required: false,
  },
  {
    key: "uniqueName",
    text: "אימייל",
    className: "uniqueNameTR",
    align: "center",
    type: "text",
    sortable: true,
    hidden: false,
    required: true,
  },
  // {
  //   key: "role",
  //   text: "תפקיד",
  //   className: "roleTR",
  //   align: "center",
  //   type: "select",
  //   sortable: true,
  //   hidden: false,
  // required: true,
  // },
  {
    key: "isActive",
    text: "סטטוס",
    className: "statusTR",
    align: "center",
    type: "switcher",
    sortable: true,
    hidden: false,
    required: true,
  },
  {
    key: "date",
    text: "הצטרף",
    className: "joinTR",
    align: "center",
    type: "none",
    sortable: true,
    hidden: false,
    required: true,
  },
  {
    key: "updatedAt",
    text: "עודכן",
    className: "updatedAtTR",
    align: "left",
    type: "none",
    sortable: true,
    hidden: false,
    required: true,
  },
  {
    key: "remarks",
    text: "הערות",
    className: "remarksTR",
    align: "left",
    type: "none",
    sortable: true,
    hidden: false,
    required: false,
  },
  {
    key: "action",
    text: "",
    className: "action",
    width: 100,
    type: "none",
    align: "left",
    sortable: false,
    required: true,
  },
];
