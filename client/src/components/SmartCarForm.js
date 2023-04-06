import React, { useEffect, useState } from "react";
import GenerationTime from "./GenerationTime";
import "../style_sheets/SmartCarForm.css";




function SmartCarForm() {

    const [generation_date, set_generation_date]=useState(null)
    const [carIDs, set_carIDs]=useState([])
    const [sensorIDs, set_sensorIDs]=useState([])

    function onSubmit(event){
        let form_data = {}
        form_data.car_id=document.getElementsByName("carid")[0].value
        form_data.sensor_id=document.getElementsByName("sensorid")[0].value
        form_data.value_id=document.getElementsByName("value")[0].value
        form_data.generation_ts = generation_date
        console.log(generation_date)
        console.log(form_data)
        if (!form_data.generation_ts)
            window.alert("Choose measure generation date")
        else if (!form_data.value_id)
            window.alert("Choose real number for sensor measure")
        else
            fetch("/simulateData", {
                method:"POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body:JSON.stringify(form_data)
            })
        event.preventDefault();
        
    }
    

    function storeCustomeDate(event){
        set_generation_date(new Date(event.target.value))
    }

    function storeCurrentDate(event){
        set_generation_date(new Date())
    }

    function resetCustomeDate(){
        set_generation_date(null)
    }

    function getSensorIDs(car_id, e){
        fetch("/sensorIDList?"+new URLSearchParams({"car_id":car_id[0]})).then((res) => res.json()).then((sensorIDs) =>{set_sensorIDs(sensorIDs)})
    }

    function onCarChange(){
        let selection=document.getElementsByName("carid")[0]
        if (selection){
            getSensorIDs(selection.value)
        }
    }


    useEffect(()=>{
        fetch("/carIDList").then((res) => res.json()).then((carIDs) => {
            set_carIDs(carIDs); 
            getSensorIDs(carIDs[0])
        });

    },[]);

    return (
        <div className="form_root">
            <div className="form_title">Smart Car Sensor Simulation</div>
            <form id="smart_car_form">
            <div className="selection_block">
                <label className='smart_car_label'>Car ID:
                    <select name="carid" className='input_smart_car smart_selection' onChange={onCarChange}>
                        {carIDs.map((car_id)=> <option key={'car'+car_id} value={car_id}>{car_id}</option>)}
                    </select>
                </label>
                
                <label className='smart_car_label sensor_label'>Sensor ID:
                    <select name="sensorid" className='input_smart_car smart_selection' >
                        {sensorIDs.map((sensor_id)=> <option key={'sensor'+sensor_id} value={sensor_id}>{sensor_id}</option>)}
                    </select>
                </label>
                <label className='smart_car_label value_input_label'>Value:
                    <input type='number' name='value' step={0.01} className='input_smart_car value_input'></input>
                </label>
            </div>
                
                <GenerationTime onDateChange={storeCustomeDate} resetDateChange={resetCustomeDate} onCurrentDateSelection={storeCurrentDate}></GenerationTime>
                <button  className="submit_button" onClick={onSubmit}><span>Add data</span></button>
            </form>
            
        </div>
    );
  }
  
  export default SmartCarForm;