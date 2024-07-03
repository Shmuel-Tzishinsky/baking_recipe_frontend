import { useEffect, useRef, useState } from "react";

import { useUsers } from "../../context/users/usersContext";
import { alertError, alertSuccess } from "../AlertOast";
import LoadingLogin from "../common/loading/Loading-login";

import ReactDataTable from "../common/tables/ReactDataTable";
import { WarningMsg } from "../common/warningMsg/WarningMsg";
import { columnForXlsx } from "./columnForXlsx";
import { columns } from "./columns";
import { config } from "./config";
import EditUsers from "./EditUsers";

/**
 * i call the this file here because in netlify server i have
 * bug that makes me sure i call the this file in the first
 * father to make sure this file call only one time
 * 👇👇👇👇
 * */
import "../common/tables/tables.css";

function Users() {
  const { state, fetchUsers, deleteUserAction, editUser, addUser } = useUsers();

  const { users, loading, loadingDelete, error, errResponse } = state;
  const [editRow, setEditRow] = useState();
  const [errorDelete, setErrorDelete] = useState();
  const [deleteRow, setDeleteRow] = useState();
  const [loadEdit, setLoadEdit] = useState();
  const [errorEdit, setErrorEdit] = useState();
  const copyTextarea = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const alertEditRow = (rowData) => {
    setEditRow(rowData);
  };
  const alertDeleteRow = (recipe) => {
    setDeleteRow(recipe._id);
  };

  const pageChange = (pageData) => {
    console.log("OnPageChange", pageData);
  };

  const customSort = (column, records, sortOrder) => {
    // console.log("column: %s, records: %O, sortOrder: %s", column, records, sortOrder);

    records = records.sort((a, b) => {
      let aObj =
        typeof a[column] === "string" ? a[column]?.replace(" ", "") || "תתתתתתתתת" : a[column];
      let bObj =
        typeof b[column] === "string" ? b[column]?.replace(" ", "") || "תתתתתתתתת" : b[column];
      if (sortOrder === "desc") {
        bObj =
          typeof a[column] === "string" ? a[column]?.replace(" ", "") || "תתתתתתתתת" : a[column];
        aObj =
          typeof b[column] === "string" ? b[column]?.replace(" ", "") || "תתתתתתתתת" : b[column];
      } else if (sortOrder === "asc") {
        aObj =
          typeof a[column] === "string" ? a[column]?.replace(" ", "") || "תתתתתתתתת" : a[column];
        bObj =
          typeof b[column] === "string" ? b[column]?.replace(" ", "") || "תתתתתתתתת" : b[column];
      }
      if (aObj > bObj) {
        return 1;
      }
      if (aObj < bObj) {
        return -1;
      }
      return 0;
    });

    return records;
  };

  const closeAlertRow = () => {
    setDeleteRow(false);
    setEditRow(false);
    setErrorDelete();
    setLoadEdit(false);
    setErrorEdit();
  };

  const editTheRow = async (user) => {
    try {
      setLoadEdit(true);
      if (editRow === "addNewUser") {
        await addUser(user);
        alertSuccess(`המשתמש ${user.name} נוסף בהצלחה!`);
        closeAlertRow();
        copyUser(user);
      } else {
        await editUser(user);
        closeAlertRow();
      }
    } catch (error) {
      setErrorEdit(error.response?.data?.error_msg || error.message || "התרחשה שגיאה");
      setLoadEdit(false);
    }
  };

  function copyUser(user) {
    if (!copyTextarea?.current) return;

    copyTextarea.current.value = `שם משתמש: ${user.uniqueName} \r\nסיסמה: ${
      user.password
    } \r\nתפקיד: ${user.role === "member" ? "סוקר" : "צוות"}`;

    copyTextarea?.current?.focus();
    copyTextarea?.current?.select();
    copyTextarea?.current?.classList?.add("textarea-not-shoeing");
    const successful = document?.execCommand("copy");

    if (successful) {
      alertSuccess("פרטי המשתמש הועתקו ללוח");
    } else {
      alertError("שגיאה מנעה את העתקה של הפרטים ללוח");
    }
  }

  return (
    <div className="data-table-container">
      <textarea
        ref={copyTextarea}
        style={{
          position: "absolute",
          width: "0",
          height: "0",
          top: "-100vh",
          left: "-100vw",
        }}
      ></textarea>

      <div className="add-new-user" onClick={() => setEditRow("addNewUser")}>
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
        >
          <path d="M11 14h2v-3h3V9h-3V6h-2v3H8v2h3z"></path>
          <path d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z"></path>
        </svg>
      </div>
      {error && (
        <h3
          style={{
            color: "red",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          שגיאה: "{errResponse}"
        </h3>
      )}
      {editRow && (
        <EditUsers
          editRow={editRow}
          loadEdit={loadEdit}
          callBack={editTheRow}
          closeAlertRow={closeAlertRow}
          error={errorEdit}
        />
      )}

      {deleteRow && (
        <WarningMsg
          alert={deleteRow}
          errorDelete={errorDelete}
          pTitle={`${loadingDelete ? "מוחק משתמש..." : "מחק משתמש"}`}
          h5Title={`שים לב לא ניתן לשחזר את המשתמש לאחר המחיקה. ${
            loadingDelete ? "" : "למחוק בכל זאת?"
          }`}
          callback={() => (!loadingDelete ? deleteUserAction(deleteRow, closeAlertRow) : "")}
          setAlert={!loadingDelete ? closeAlertRow : () => ""}
          dBtn={loadingDelete ? <LoadingLogin /> : "מחק"}
          bBtn={"בטל"}
        />
      )}
      <ReactDataTable
        className="table-export-table"
        config={config}
        records={users || []}
        columns={columns || []}
        onPageChange={pageChange}
        editRow={editRow}
        alertDeleteRow={alertDeleteRow}
        onEditRow={alertEditRow}
        loading={loading}
        onSort={customSort}
        id="as-react-users-dataTable"
        dynamic={false}
        total_record={0}
        columnForXlsx={columnForXlsx}
        onChange={() => {}}
      />
    </div>
  );
}

export default Users;
