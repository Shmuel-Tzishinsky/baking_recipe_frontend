import React from "react";

export default function InitialPagination(props) {
  return (
    <ul className="nav-ul">
      {props.config.show_first ? (
        <li className={(props.isFirst ? "disabled " : "") + "page-item page-link"} onClick={props.firstPage}>
          <span>{props.config.language.pagination.first}</span>
        </li>
      ) : null}
      <li className={(props.isFirst ? "disabled " : "") + "page-item page-link"} onClick={props.previousPage}>
        {props.config.language.pagination.previous}
      </li>
      <li className="page-item">
        <div className="page-link">
          <input
            style={{
              border: "none",
              padding: "0",
              maxWidth: "30px",
              textAlign: "center",
              display: "inline-block",
              height: "34px",
            }}
            type="number"
            min={0}
            max={props.pages}
            value={props.is_temp_page ? props.temp_page_number : props.page_number}
            onChange={(e) => props.onPageChange(e, true)}
            onBlur={props.onPageBlur}
            onKeyDown={props.onPageChange}
          />
        </div>
      </li>
      <li className={(props.isLast ? "disabled " : "") + "page-item page-link"} onClick={props.nextPage}>
        {props.config.language.pagination.next}
      </li>
      {props.config.show_last ? (
        <li className={(props.isLast ? "disabled " : "") + "page-item page-link"} onClick={props.lastPage}>
          <span>{props.config.language.pagination.last}</span>
        </li>
      ) : null}
    </ul>
  );
}
