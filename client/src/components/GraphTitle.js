import React from "react";
import "../style_sheets/GraphTitle.css"

function GraphTitle(props) {

    return (
        <div>
            <div className="graph_title">
                {props.title}
            </div>
        </div>
    );
  }
  
  export default GraphTitle;