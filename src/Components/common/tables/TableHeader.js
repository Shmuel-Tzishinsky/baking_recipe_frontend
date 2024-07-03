import React, { useEffect, useState } from "react";

import { AiFillPrinter, AiOutlineDownload, AiOutlineFilter } from "react-icons/ai";
import { FaFileCsv } from "react-icons/fa";
import { RiFileExcel2Fill } from "react-icons/ri";
import { Switcher } from "../../../Components/common/navMenu/Switcher";
import { VscSearch } from "react-icons/vsc";
import includes from "lodash/includes";
import { BsFilterRight } from "react-icons/bs";

export default function TableHeader(props) {
  const [showDownloadList, setShowDownloadList] = useState(!1);
  const handelSearch = (e) => {
    props.filterRecords();
    props.searchParams({ q: e.target.value.replace(/(^\s+| \s+$)/g, "") });
  };

  if (
    props.config.show_length_menu === true ||
    props.config.show_filter === true ||
    props.config.button.excel === true ||
    props.config.button.csv === true ||
    props.config.button.print === true
  ) {
    return (
      <div className="table-head" id={props.id ? props.id + "-table-head" : ""}>
        <div className="table-changes">
          {props.config.show_filter ? (
            <div className="table_filter download-container">
              <label>הורד</label>
              <div className="form-control">
                <AiOutlineDownload className="search-icon" />
                <div
                  className={`form-control-div ${showDownloadList ? "show-list-download" : ""}`}
                  onClick={() => setShowDownloadList(!0)}
                />
                {showDownloadList && (
                  <>
                    <div className="alert-hidden-all-page" onClick={() => setShowDownloadList(!1)}></div>

                    <div className="list-download" onClick={() => setShowDownloadList(!1)}>
                      {props.config.button.excel && (
                        <div className="option-download" onClick={props.exportToExcel}>
                          <RiFileExcel2Fill />
                        </div>
                      )}
                      {props.config.button.csv && (
                        <div className="option-download" onClick={props.exportToCSV}>
                          <FaFileCsv />
                        </div>
                      )}
                      {props.config.button.print && (
                        <div className="option-download" onClick={props.exportToPDF}>
                          <AiFillPrinter />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>
        <div className="table-changes">
          {props.config.show_filter ? (
            <div className="table_filter">
              <label>חפש ברשומות</label>
              <div className="form-control">
                <VscSearch className="search-icon" />
                <input
                  type="search"
                  className="form-control-input"
                  value={props.value || ""}
                  placeholder={props.config.language.filter}
                  onChange={handelSearch}
                />
              </div>
              {!props.filterRecordsVariable.length && (
                <p
                  style={{
                    fontSize: "10px",
                    color: "red",
                    margin: "5px 5px 0 0 ",
                    textAlign: "right",
                    maxWidth: "200px",
                  }}
                >
                  <span>
                    <b>{props.config.language.no_data_text} </b>
                    {props.config.hidden_fields && "שים לב שהעמודה הרלוונטית לא מוסתרת"}
                  </span>
                </p>
              )}
            </div>
          ) : null}
        </div>
        {props.config.hidden_fields && (
          <div className="table-changes">
            <HiddenFields columns={props.columns} setColumns={props.setColumns} />
          </div>
        )}
        {props.config.show_length_menu ? (
          <div className="table-changes">
            <div className="table_filter">
              <label>שורות בדף</label>
              <div className="form-control">
                <BsFilterRight className="filter-icon" />
                {includes(props.config.language.length_menu, "_MENU_") ? (
                  <select type="text" className="form-control-select" onChange={props.changePageSize}>
                    {props.config.length_menu.map((value, key) => {
                      return (
                        <option key={value} value={value}>
                          {value} שורות בדף
                        </option>
                      );
                    })}
                  </select>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  } else {
    return null;
  }
}

const HiddenFields = ({ columns, setColumns }) => {
  const [showListHidden, setShowListHidden] = useState(!1);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setSearchInput("");
  }, [showListHidden]);

  const showAllFields = () => {
    for (let i = 0; i < columns.length; i++) {
      columns[i].hidden = false;
    }
    setColumns([...columns]);
  };

  return (
    <>
      {showListHidden && <div className="alert-hidden-all-page" onClick={() => setShowListHidden(!1)}></div>}
      <div className="hidden_fields_container">
        <div className="hidden_fields_head" onClick={() => setShowListHidden(!showListHidden)}>
          <label data-num={columns.filter((c) => c.hidden).length}>הסתר עמודות</label>
          <div className="form-control">
            <AiOutlineFilter className="filter-icon" />
            <input
              className={`hidden_fields_demo_input ${showListHidden ? "show-list-hidden" : ""}`}
              value={"סנן עמודות.."}
              readOnly
            />
          </div>
        </div>
        {showListHidden && (
          <div className="hidden_fields_menu">
            <input
              type="search"
              value={searchInput}
              className="hidden_fields_input"
              onInput={(e) => setSearchInput(e.target.value)}
              placeholder="חפש עמודה..."
            />
            <div className="hidden_fields_options">
              {columns.map(
                (c, i) =>
                  c.sortable && (
                    <HiddenFieldsOptions
                      key={i}
                      searchInput={searchInput}
                      hiddenFields={c.hidden}
                      index={i}
                      columns={columns}
                      setColumns={setColumns}
                    />
                  )
              )}
            </div>
            <button onClick={showAllFields}>הצג הכל</button>
          </div>
        )}
      </div>
    </>
  );
};

const HiddenFieldsOptions = ({ hiddenFields, index, searchInput, columns, setColumns }) => {
  const setHidden = () => {
    columns[index].hidden = !columns[index].hidden;
    setColumns([...columns]);
  };

  return (
    columns[index].text.toString().toLowerCase().indexOf(searchInput.toString().toLowerCase()) > -1 && (
      <div className={`hidden_fields_option ${hiddenFields ? "hidden_fields" : ""}`} onClick={setHidden}>
        <div>{columns[index].text}</div>
        <Switcher checked={!hiddenFields} />
      </div>
    )
  );
};
