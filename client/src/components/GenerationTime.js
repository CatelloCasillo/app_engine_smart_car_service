import React, { useEffect, useState } from "react";
import '../style_sheets/GenerationTime.css'
function convert_date(input_date){

    let date = [input_date.getFullYear(), ("0" + input_date.getMonth()).slice(-2), ("0" + input_date.getDate()).slice(-2)].join("-")
    let clock = [input_date.getHours(), ("0" + input_date.getMinutes()).slice(-2), ("0" + input_date.getSeconds()).slice(-2)].join(":")
    return [date, clock].join(" ")
}

function GenerationTime(props){

    const[current_data, set_current_data]=useState(new Date())
    const[timerID, set_timerID ] = useState({})
    const[current_date_checked, set_current_date_checked] = useState(false)
    const[custom_date_checked, set_custom_date_checked] = useState(false)


    useEffect(()=>{
        let temp_timerID=setInterval(()=>{
            set_current_data(new Date())
        },1000)
        set_timerID(temp_timerID)
        return function destroy_timer(){
            clearInterval(timerID)
        }
    },[])

    function currentDateOnChange(event){
        set_current_date_checked(true)
        set_custom_date_checked(false)
        props.onCurrentDateSelection()
    }

    function customDateOnChange(event){
        set_current_date_checked(false)
        set_custom_date_checked(true)
    }

    function div_class(){
        if (!current_date_checked && !custom_date_checked)
            return "no_selection"
        else
            return "current_date_selected"

    }

    return(
        <div className="generation_time_container">
            <div className={div_class()}>
                <input type="radio" className="smart_radio" id="current_date" name="generarion_date" value="True" onChange={currentDateOnChange}></input>
                <label className="generation_label" htmlFor = "current_date">Use actual time {current_date_checked?<span className="actual_time">{convert_date(current_data)}</span>:""} </label>
            </div>
            <div className={(custom_date_checked?"custom_date_container_selected":"custom_date_container")+" date_container" }>
                <input type="radio" className="smart_radio" id="custome_date" name="generarion_date" value="True" onChange={customDateOnChange}></input>
                <label className="generation_label" htmlFor = "custome_date">{custom_date_checked?<span>Use custom date<input type="datetime-local" className="custome_date" onChange={props.onDateChange}></input></span>:"Use custom date"}</label>
            </div>
        </div>
    )
}

export default GenerationTime