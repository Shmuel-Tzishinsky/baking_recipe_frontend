import React from "react";
import Pagination from "./Pagination";
import ADPagination from "./ADPagination";

export default function TableFooter(props) {
  if (props.config.show_info === true || props.config.show_pagination === true) {
    return (
      <div className="table-footer" id={props.id ? props.id + "-table-foot" : ""}>
        {props.config.show_pagination ? (
          <nav aria-label="Page navigation" className="pull-nav">
            {props.config.pagination === "basic" ? (
              <Pagination
                config={props.config}
                isFirst={props.isFirst}
                isLast={props.isLast}
                pages={props.pages}
                page_number={props.page_number}
                is_temp_page={props.is_temp_page}
                temp_page_number={props.temp_page_number}
                previousPage={props.previousPage}
                firstPage={props.firstPage}
                nextPage={props.nextPage}
                lastPage={props.lastPage}
                goToPage={props.goToPage}
                onPageChange={props.onPageChange}
                onPageBlur={props.onPageBlur}
              />
            ) : (
              <ADPagination
                language={props.config.language}
                isFirst={props.isFirst}
                isLast={props.isLast}
                pages={props.pages}
                page_number={props.page_number}
                previousPage={props.previousPage}
                nextPage={props.nextPage}
                goToPage={props.goToPage}
              />
            )}
          </nav>
        ) : null}
        <div className="pagination-info">{props?.config?.show_info ? props?.paginationInfo : null}</div>
      </div>
    );
  } else {
    return null;
  }
}
