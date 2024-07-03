import React, { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { useSearchParams } from "react-router-dom";

import TableHeader from "./TableHeader";
import TableFooter from "./TableFooter";
import xlsx from "json-as-xlsx";
import { getHighlightedText } from "../../../assets/js/globalFunc";
import { BsTrash } from "react-icons/bs";
import { Switcher } from "../navMenu/Switcher";

const ReactDataTable = (props) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [columns, setColumns] = useState(props.columns || []);
  const [state, setState] = useState({
    is_temp_page: false,
    page_size: props.config.page_size ? props.config.page_size : 10,
    page_number: 1,
    sort: props.config && props.config.sort ? props.config.sort : false,
    temp_page_number: 0,
  });

  const config = {
    button: {
      excel:
        props.config && props.config.button && props.config.button.excel ? props.config.button.excel : false,
      print:
        props.config && props.config.button && props.config.button.print ? props.config.button.print : false,
      csv: props.config && props.config.button && props.config.button.csv ? props.config.button.csv : false,
      extra:
        props.config && props.config.button && props.config.button.extra ? props.config.button.extra : false,
    },
    filename: props.config && props.config.filename ? props.config.filename : "table",
    key_column: props.config && props.config.key_column ? props.config.key_column : "id",
    language: {
      length_menu:
        props.config && props.config.language && props.config.language.length_menu
          ? props.config.language.length_menu
          : "_MENU_",
      filter:
        props.config && props.config.language && props.config.language.filter
          ? props.config.language.filter
          : "Search in records...",
      info:
        props.config && props.config.language && props.config.language.info
          ? props.config.language.info
          : "Showing _START_ to _END_ of _TOTAL_ entries",
      pagination: {
        first:
          props.config &&
          props.config.language &&
          props.config.language.pagination &&
          props.config.language.pagination.first
            ? props.config.language.pagination.first
            : "First",
        previous:
          props.config &&
          props.config.language &&
          props.config.language.pagination &&
          props.config.language.pagination.previous
            ? props.config.language.pagination.previous
            : "Previous",
        next:
          props.config &&
          props.config.language &&
          props.config.language.pagination &&
          props.config.language.pagination.next
            ? props.config.language.pagination.next
            : "Next",
        last:
          props.config &&
          props.config.language &&
          props.config.language.pagination &&
          props.config.language.pagination.last
            ? props.config.language.pagination.last
            : "Last",
      },
      no_data_text:
        props.config && props.config.language && props.config.language.no_data_text
          ? props.config.language.no_data_text
          : "לא נמצאו רשומות!",
      loading_text:
        props.config && props.config.language && props.config.language.loading_text
          ? props.config.language.loading_text
          : "טוען...",
    },
    length_menu: props.config && props.config.length_menu ? props.config.length_menu : [10, 25, 50, 75, 100],
    show_length_menu: props.config.show_length_menu !== undefined ? props.config.show_length_menu : true,
    show_filter: props.config.show_filter !== undefined ? props.config.show_filter : true,
    hidden_fields: props.config.hidden_fields !== undefined ? props.config.hidden_fields : true,
    show_pagination: props.config.show_pagination !== undefined ? props.config.show_pagination : true,
    show_info: props.config.show_info !== undefined ? props.config.show_info : true,
    show_first: props.config.show_first !== undefined ? props.config.show_first : true,
    show_last: props.config.show_last !== undefined ? props.config.show_last : true,
    pagination: props.config.pagination ? props.config.pagination : "basic",
  };

  useEffect(() => {
    const newColumns = [];
    if (!config.hidden_fields) {
      for (let i = 0; i < props?.columns?.length; i++) {
        props.columns[i].hidden = false;
        newColumns.push(props.columns[i]);
      }
      setColumns([...newColumns]);
    }
  }, [config.hidden_fields, props.columns]);

  const filterRecords = (e) => {
    setState({
      ...state,
      page_number: 1,
    });
    // onChange();
  };

  const changePageSize = (e) => {
    let value = e.target.value;

    setState({
      ...state,
      page_size: value,
    });
    // onChange();
  };

  const sortColumn = (event, column, sortOrder) => {
    if (!column.sortable) return false;
    let newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setState({
      ...state,
      sort: { column: column.key, order: newSortOrder },
      page_number: 1,
    });
    // onChange();
  };

  const paginate = (records) => {
    let page_size = state.page_size;
    let page_number = state.page_number;
    --page_number; // because pages logically start with 1, but technically with 0
    return records.slice(page_number * page_size, (page_number + 1) * page_size);
  };

  const numPages = (totalRecord) => {
    return Math.ceil(totalRecord / state.page_size);
  };

  const isLast = () => {
    // because for empty records page_number will still be 1
    if (pages === 0) {
      return true;
    }
    if (state.page_number === pages) {
      return true;
    } else {
      return false;
    }
  };

  const isFirst = () => {
    if (state.page_number === 1) {
      return true;
    } else {
      return false;
    }
  };

  const goToPage = (e, pageNumber) => {
    e.preventDefault();
    if (state.page_number === pageNumber) {
      return;
    }
    let pageState = {
      previous_page: state.page_number,
      current_page: pageNumber,
    };
    setState({
      ...state,
      is_temp_page: false,
      page_number: pageNumber,
    });
    props.onPageChange(pageState);
    // onChange();
  };

  const firstPage = (e) => {
    e.preventDefault();
    if (isFirst()) return;
    goToPage(e, 1);
  };

  const lastPage = (e) => {
    e.preventDefault();
    if (isLast()) return;
    goToPage(e, pages);
  };

  const previousPage = (e) => {
    e.preventDefault();
    if (isFirst()) return false;
    goToPage(e, state.page_number - 1);
  };

  const nextPage = (e) => {
    e.preventDefault();
    if (isLast()) return;
    goToPage(e, parseInt(state.page_number) + 1);
  };

  const onPageChange = (e, isInputChange = false) => {
    if (isInputChange) {
      setState({
        ...state,
        is_temp_page: true,
        temp_page_number: e.target.value,
      });
    } else {
      if (e.key === "Enter") {
        let pageNumber = e.target.value;
        goToPage(e, pageNumber);
      }
    }
  };

  const onPageBlur = (e) => {
    let pageNumber = e.target.value;
    goToPage(e, pageNumber);
  };

  const strip = (html) => {
    let doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const getExportHtml = () => {
    let tableHtml = "<table>";
    tableHtml += "<thead>";
    tableHtml += "<tr>";
    for (let column of columns) {
      if (column.key === "action") {
        continue;
      }
      tableHtml += "<th>" + column.text + "</th>";
    }
    tableHtml += "</tr>";
    tableHtml += "</thead>";
    tableHtml += "<tbody>";

    // Filter records before export
    let filterRecords = props.records;
    if (props.dynamic === false) {
      let records = sortRecords(),
        filterValue = query;
      filterRecords = records;

      if (filterValue) {
        filterRecords = filterData(records);
      }
    }

    for (let i in filterRecords) {
      let record = filterRecords[i];
      tableHtml += "<tr>";
      for (let column of columns) {
        if (column.key === "action") {
          continue;
        }
        if (column.cell && typeof column.cell === "function") {
          let cellData = ReactDOMServer.renderToStaticMarkup(column.cell(record, i));

          cellData = strip(cellData);
          tableHtml += "<td>" + cellData + "</td>";
        } else if (record[column.key]) {
          tableHtml += "<td>" + record[column.key] + "</td>";
        } else {
          tableHtml += "<td></td>";
        }
      }
      tableHtml += "</tr>";
    }
    tableHtml += "</tbody>";
    tableHtml += "</table>";

    return tableHtml;
  };

  const exportToExcel = () => {
    let headers = [];
    // add columns in sheet array
    for (let column of columns) {
      if (column.key === "action") {
        continue;
      }

      headers.push({ label: column.text, value: column.key });
    }

    // Filter records before export
    let filterRecords = props.records;

    if (props.dynamic === false) {
      let records = sortRecords(),
        filterValue = query;
      filterRecords = records;

      if (filterValue) {
        filterRecords = filterData(records);
      }
    }

    let records = [];
    // add data rows in sheet array
    for (let i in filterRecords) {
      let record = filterRecords[i],
        newRecord = {};
      for (let column of columns) {
        if (column.key === "action") {
          continue;
        }
        if (column.cell && typeof column.cell === "function") {
          let cellData = ReactDOMServer.renderToStaticMarkup(column.cell(record, i));
          cellData = strip(cellData);
          newRecord[column.key] = cellData;
        } else if (record[column.key]) {
          let colValue = record[column.key];
          colValue = typeof colValue === "string" ? colValue.replace(/"/g, '""') : colValue;
          newRecord[column.key] = '"' + colValue + '"';
        } else {
          newRecord[column.key] = "";
        }
      }
      records.push(newRecord);
    }
    if (headers.length) {
      records.unshift(headers);
    }

    let data = [
      {
        sheet: "Adults",
        columns: props.columnForXlsx,
        content: filterRecords || [],
      },
    ];

    let settings = {
      fileName: "data_table", // Name of the resulting spreadsheet
      extraLength: 3, // A bigger number means that columns will be wider
      writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
      writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
      RTL: true, // Display the columns from right-to-left (the default value is false)
    };

    xlsx(data, settings);
  };

  const exportToPDF = () => {
    let tableHtml = getExportHtml();

    let style = "<style>";
    style = style + "table {direction: rtl;width: 100%;font: 17px Calibri;}";
    style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    style = style + "padding: 2px 3px;text-align:left;margin:0;text-align: center; vertical-align: middle;}";
    style = style + "</style>";

    let win = window.open("", "_blank");
    win.document.write("<html><head>");
    win.document.write("<title>" + config.filename + "</title>");
    win.document.write(style);
    win.document.write("</head>");
    win.document.write("<body>");
    win.document.write("<h1>" + config.filename + "</h1>");
    win.document.write(tableHtml);
    win.document.write("</body></html>");
    win.print();
    win.close();
  };

  const convertToCSV = (objArray) => {
    let array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    for (let i = 0; i < array.length; i++) {
      let line = "";
      for (let index in array[i]) {
        if (line !== "") line += ",";
        line += array[i][index];
      }
      str += line + "\r\n";
    }

    return str;
  };

  const exportToCSV = () => {
    let headers = {};
    // add columns in sheet array
    for (let column of columns) {
      if (column.key === "action") {
        continue;
      }
      headers[column.key] = '"' + column.text + '"';
    }

    // Filter records before export
    let filterRecords = props.records;
    if (props.dynamic === false) {
      let records = sortRecords(),
        filterValue = query;
      filterRecords = records;

      if (filterValue) {
        filterRecords = filterData(records);
      }
    }

    let records = [];
    // add data rows in sheet array
    for (let i in filterRecords) {
      let record = filterRecords[i],
        newRecord = {};
      for (let column of columns) {
        if (column.key === "action") {
          continue;
        }
        if (column.cell && typeof column.cell === "function") {
          let cellData = ReactDOMServer.renderToStaticMarkup(column.cell(record, i));
          cellData = strip(cellData);
          newRecord[column.key] = cellData;
        } else if (record[column.key]) {
          let colValue = record[column.key];
          colValue = typeof colValue === "string" ? colValue.replace(/"/g, '""') : colValue;
          newRecord[column.key] = '"' + colValue + '"';
        } else {
          newRecord[column.key] = "";
        }
      }
      records.push(newRecord);
    }
    if (headers) {
      records.unshift(headers);
    }
    // Convert Object to JSON
    let jsonObject = JSON.stringify(records);
    let csv = String.fromCharCode(0xfeff) + convertToCSV(jsonObject);
    let exportedFilename = config.filename + ".csv" || "export.csv";
    let blob = new Blob([csv], { type: "text/csv;charset=UTF-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, exportedFilename);
    } else {
      let link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    }
  };

  // const onChange = () => {
  //   console.log(state.page_size);
  //   let tableData = {
  //     filter_value: query,
  //     page_number: state.page_number,
  //     page_size: state.page_size,
  //     sort_order: state.sort,
  //   };
  //   // sortRecords();
  //   props.onChange(tableData);
  // };

  const filterData = (records) => {
    let filterValue = query;
    return records.filter((record) => {
      let allow = false;
      columns.forEach((column, key) => {
        if (!column.hidden && record[column.key]) {
          allow =
            record[column.key].toString().toLowerCase().indexOf(filterValue.toString().toLowerCase()) > -1
              ? true
              : allow;
        }
      });
      return allow;
    });
  };

  const sortRecords = () => {
    if (state.sort) {
      return props.records.sort((a, b) => {
        let aObj = a[state.sort.column];
        let bObj = b[state.sort.column];

        //   if (typeofColVal === "string") {
        //     if (isNaN(colVal)) {
        //       return String(colVal.toLowerCase());
        //     } else {
        //       return Number(colVal);
        //     }
        //   } else if (typeofColVal === "number") {
        //     return Number(colVal);
        //   }
        // }
        // [state.sort.order]

        if (aObj < bObj) {
          return 1;
        }
        if (aObj > bObj) {
          return -1;
        }
        return 0;
      });
    } else {
      return props.records;
    }
  };

  let filterRecordsVariable, totalRecords, pages, isFirstVariable, isLastVariable;

  if (props.dynamic === false) {
    let records = props.onSort
        ? props.onSort(state.sort.column, props.records, state.sort.order)
        : sortRecords(),
      filterValue = query;
    filterRecordsVariable = records;

    if (filterValue) {
      filterRecordsVariable = filterData(records);
    }
    totalRecords = Array.isArray(filterRecordsVariable) ? filterRecordsVariable.length : 0;
    pages = numPages(totalRecords);
    isFirstVariable = isFirst();
    isLastVariable = isLast();
    filterRecordsVariable = Array.isArray(filterRecordsVariable) ? paginate(filterRecordsVariable) : [];
  } else {
    filterRecordsVariable = props.records;
    totalRecords = props.total_record;
    pages = numPages(totalRecords);
    isFirstVariable = isFirst();
    isLastVariable = isLast();
  }

  let startRecords = state.page_number * state.page_size - (state.page_size - 1);
  let endRecords = state.page_size * state.page_number;
  endRecords = endRecords > totalRecords ? totalRecords : endRecords;

  let paginationInfo = config.language.info;
  paginationInfo = paginationInfo.replace("_START_", state.page_number === 1 ? 0 : startRecords - 1);
  paginationInfo = paginationInfo.replace("_END_", endRecords);
  paginationInfo = paginationInfo.replace("_TOTAL_", totalRecords);

  return (
    <div className="container-export-table" id={props.id ? props.id + "-container" : ""}>
      {props.loading ? (
        <div className="asrt-td-loading" align="center">
          <div className="asrt-loading-textwrap">
            <span className="asrt-loading-text">{config.language.loading_text}</span>
          </div>
        </div>
      ) : (
        <>
          <TableHeader
            changePageSize={changePageSize}
            config={config}
            filterRecordsVariable={filterRecordsVariable}
            id={props.id}
            setColumns={setColumns}
            columns={columns}
            value={query}
            recordLength={props.dynamic ? props.total_record : props.records.length}
            searchParams={setSearchParams}
            filterRecords={filterRecords}
            exportToExcel={exportToExcel}
            exportToCSV={exportToCSV}
            exportToPDF={exportToPDF}
            extraButtons={props.extraButtons}
          />
          <div className="export-table table_body" id={props.id ? props.id + "-table-body" : ""}>
            <table className={props.className} id={props.id}>
              <thead className={props.tHeadClassName ? props.tHeadClassName : ""}>
                <tr>
                  {columns.map((column, index) => {
                    let classText = column.sortable ? "sortable " : "",
                      align = column.align ? column.align : "",
                      sortOrder = "",
                      columnStyle = {};
                    if (column.sortable && state.sort.column === column.key) {
                      sortOrder = state.sort.order;
                      classText += sortOrder ? " " + sortOrder : "";
                      columnStyle = sortOrder === "asc" ? "sort_asc" : "sort_desc";
                    }

                    classText += " text-" + align;
                    if (column.TrOnlyClassName) classText += " " + column.TrOnlyClassName;
                    if (!column.hidden)
                      return (
                        <th
                          key={column.key ? column.key : column.text}
                          className={`${column.className} ${classText}`}
                          style={columnStyle}
                          onClick={(event) => sortColumn(event, column, sortOrder)}
                        >
                          {column.text}
                        </th>
                      );
                    else return null;
                  })}
                </tr>
              </thead>
              <tbody>
                {!filterRecordsVariable.length ? (
                  <tr>
                    <td>
                      {" "}
                      <div className="asrt-td-loading" align="center"></div>
                    </td>
                  </tr>
                ) : (
                  filterRecordsVariable.map((record, rowIndex) => {
                    return (
                      <tr
                        key={record[config.key_column]}
                        className={`${
                          record?.wrongRide === "true"
                            ? "wrong-ride"
                            : record?.updatedAt?.length
                            ? "travel-updated"
                            : ""
                        } `}
                      >
                        {columns.map((column, colIndex) => {
                          if (column.key === "action" && !column.hidden) {
                            return (
                              <td className={column.className} key={column.key ? column.key : column.text}>
                                <div className={column.className}>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => props.alertDeleteRow(record)}
                                  >
                                    <BsTrash />
                                  </button>
                                </div>
                              </td>
                            );
                          } else if (
                            record[column.key] !== null &&
                            record[column.key] !== undefined &&
                            !column.hidden
                          ) {
                            if (column.key === "isActive") {
                              return (
                                <td
                                  className={column.className}
                                  key={column.key ? column.key : column.text}
                                  onClick={() => props.onEditRow(record)}
                                >
                                  <div>
                                    <Switcher checked={record[column.key]} />
                                  </div>
                                </td>
                              );
                            } else {
                              return (
                                <td
                                  className={column.className}
                                  key={column.key ? column.key : column.text}
                                  onClick={() => props.onEditRow(record)}
                                >
                                  <div> {getHighlightedText(record[column.key], query)}</div>
                                </td>
                              );
                            }
                          } else if (!column.hidden) {
                            return (
                              <td
                                className={column.className}
                                key={column.key ? column.key : column.text}
                                onClick={() => props.onEditRow(record)}
                              >
                                <div></div>
                              </td>
                            );
                          } else return null;
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <TableFooter
            config={config}
            id={props.id}
            isFirst={isFirstVariable}
            isLast={isLastVariable}
            paginationInfo={paginationInfo}
            pages={pages}
            page_number={state.page_number}
            is_temp_page={state.is_temp_page}
            temp_page_number={state.temp_page_number}
            firstPage={firstPage}
            lastPage={lastPage}
            previousPage={previousPage}
            nextPage={nextPage}
            goToPage={goToPage}
            onPageChange={onPageChange}
            onPageBlur={onPageBlur}
          />
        </>
      )}
    </div>
  );
};

export default ReactDataTable;
