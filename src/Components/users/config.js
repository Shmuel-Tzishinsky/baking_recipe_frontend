import { AiOutlineLeft, AiOutlineRight, AiOutlineVerticalLeft, AiOutlineVerticalRight } from "react-icons/ai";

export const config = {
  key_column: "_id",
  page_size: 10,
  length_menu: [10, 25, 50, 75, 100],
  filename: "Users",
  button: {
    excel: true,
    print: true,
    csv: true,
    extra: false,
  },
  language: {
    no_data_text: "לא נמצאו משתמשים!",
    length_menu: "_MENU_",
    filter: "חפש ברשומות...",
    info: "_END_-_START_ מתוך _TOTAL_",
    pagination: {
      first: <AiOutlineVerticalRight />,
      previous: (
        <span>
          <AiOutlineLeft />
        </span>
      ),
      next: (
        <span>
          <AiOutlineRight />
        </span>
      ),
      last: <AiOutlineVerticalLeft />,
    },
  },
  pagination: window.innerWidth > 400 ? "advance" : "basic", //advance
  show_length_menu: true,
  hidden_fields: true,
  show_filter: true,
  show_pagination: true,
  show_info: true,

  sort: {
    column: "test",
    order: "asc",
  },

  show_first: true,
  show_last: true,
};
