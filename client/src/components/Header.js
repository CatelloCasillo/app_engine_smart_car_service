import React from "react";
import "../style_sheets/Header.css"
//import {DateRangePicker, Provider, defaultTheme} from '@adobe/react-spectrum'
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';


function Header(props) {


    let styles = {"width": "100%", "height":"100%", "textAlign":"20px"}
    return (
        <div className="header">
            <img src = "data_pipeline.png" alt="Format not supported" id="header_img" className="header_element"></img>
            <div className="header_title header_element">
                <div id="header_text">Data pipeline<br/>Temporal Analysis</div>
                <div id="date_chooser">
                  <DateRangePicker  placeholder= "Select Date Range" size='lg' onChange={props.onChangeDateRangeHandler} style={styles}/>    
                </div>
                
            </div>
        </div>
    );
  }
  /*
  <Provider theme={defaultTheme}>
                        <DateRangePicker back/>
                    </Provider>
  */                
  export default Header;