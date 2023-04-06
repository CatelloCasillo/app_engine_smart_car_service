import React from "react";
import "../style_sheets/App.css";
import "./Header";
import Header from "./Header";
import GraphTitle from "./GraphTitle";
import ConfidenceGraph from "./ConfidenceGraph";
import MultiseriesGraph from "./MultiSeriesGraph"
import {mean, std, min, max} from 'mathjs';

function extract_total_delay(process, input){
  let out = [];
  for(const x of input)
    if(x.process_number===process)
      out.push((x.insertion_date.getTime()-x.generation_date.getTime())/1000);
  return out;
}

function extract_ingestion_delay(process, input){
  let out = [];
  for(const x of input)
    if(x.process_number===process)
      out.push((x.pre_elab_date.getTime()-x.generation_date.getTime())/1000);
  return out;
}

function extract_storage_delay(process, input){
  let out = [];
  for(const x of input)
    if(x.process_number===process)
      out.push((x.insertion_date.getTime()-x.pre_elab_date.getTime())/1000);
  return out;
}

function get_std_graph_data(value_diffs, value_avg){
  var std_graph_data = []
  
  let i = 0;
  for (const minute of Object.keys(value_diffs)){
    if (value_diffs[minute].length!==0){
      let std_dev = std(value_diffs[minute])
      console.log("Deviazione standrd")
      console.log(std_dev)
      /* 
      std_graph_data.upper_conf.push(value_avg[i]+(std_dev/2))
      std_graph_data.low_conf.push(-(std_dev/2));
      std_graph_data.min.push(min(value_diffs[minute]));
      std_graph_data.max.push(max(value_diffs[minute]));
      std_graph_data.avg.push(value_avg[i]);
      std_graph_data.time.push(minute);
      */
      std_graph_data.push({
        'avg': value_avg[i],
        'min': min(value_diffs[minute]),
        'max': max(value_diffs[minute]),
        'upper_conf': value_avg[i]+(std_dev/2),
        'low_conf': value_avg[i]-(std_dev/2),
        'time': minute
      })
      i++;
    }
  }

  return std_graph_data
}


function App() {
  
  const [avg_graph_data, set_avg_graph_data] = React.useState({'single_process':{'total_delay':[], 'ingestion_delay':[], 'storage_delay':[], 'time':[]}, 
                                                               'multi_process':{'total_delay':[], 'ingestion_delay':[], 'storage_delay':[], 'time':[]}});
                                                               /*
  const [total_delay_graph_data, set_total_delay_graph_data] = React.useState({'single_process':{'avg':[],'min':[],'max':[],'upper_conf':[],'low_conf':[],'time':[]},
                                                                                'multi_process':{'avg':[],'min':[],'max':[],'upper_conf':[],'low_conf':[],'time':[]}});
  const [ingestion_delay_graph_data, set_ingestion_delay_graph_data] = React.useState({'single_process':{'avg':[],'min':[],'max':[],'upper_conf':[],'low_conf':[],'time':[]},
                                                                                'multi_process':{'avg':[],'min':[],'max':[],'upper_conf':[],'low_conf':[],'time':[]}});
  const [storage_delay_graph_data, set_storage_delay_graph_data] = React.useState({'single_process':{'avg':[],'min':[],'max':[],'upper_conf':[],'low_conf':[],'time':[]},
                                                                                'multi_process':{'avg':[],'min':[],'max':[],'upper_conf':[],'low_conf':[],'time':[]}});                                                                             
*/
  const [total_delay_graph_data, set_total_delay_graph_data] = React.useState({'single_process':[], 'multi_process':[]})
  const [ingestion_delay_graph_data, set_ingestion_delay_graph_data] = React.useState({'single_process':[], 'multi_process':[]})
  const [storage_delay_graph_data, set_storage_delay_graph_data] = React.useState(({'single_process':[], 'multi_process':[]})) 
  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        var dates = data.map((x)=>{
          let insertion_date = new Date(x.insertion_ts.value);
          let generation_date = new Date(x.generation_ts.value);
          let pre_elab_date = new Date(x.pre_elab_ts.value)
          let process_number = x.process_number
          return {insertion_date, generation_date, pre_elab_date, process_number}
          
        });
        //Gruppare i dati per minuti
        let group = {}
        for(const x of dates){
          let minute = x.generation_date.getFullYear().toString()+"/"+(x.generation_date.getMonth()+1).toString()+"/"+x.generation_date.getDate().toString()+" "+
          x.generation_date.getHours().toString()+":"+x.generation_date.getMinutes().toString(); 
          if (!group[minute]) {
            group[minute] = [];
          }
          group[minute].push(x);
          
        }
        

        var total_delay ={};
        var ingestion_delay = {};
        var storage_delay = {};

        var total_delay_single = {};
        var total_delay_multi = {};
        var ingestion_delay_single = {};
        var ingestion_delay_multi = {};
        var storage_delay_single = {};
        var storage_delay_multi = {};
        for(const minute of Object.keys(group)){
            total_delay[minute] = group[minute].map((x)=>{return x.insertion_date.getTime()-x.generation_date.getTime()/1000});
            ingestion_delay[minute] = group[minute].map((x)=>(x.pre_elab_date.getTime()-x.generation_date.getTime())/1000);
            storage_delay[minute] = group[minute].map((x)=>(x.insertion_date.getTime()-x.pre_elab_date.getTime())/1000);
        }
        //Calcolare le differenze fra le date
        for(const minute of Object.keys(group)){
          total_delay_single[minute] = extract_total_delay(1, group[minute])
          total_delay_multi[minute] = extract_total_delay(8, group[minute])
          ingestion_delay_single[minute] = extract_ingestion_delay(1, group[minute])
          ingestion_delay_multi[minute] = extract_ingestion_delay(8, group[minute])
          storage_delay_single[minute] = extract_storage_delay(1, group[minute])
          storage_delay_multi[minute] = extract_storage_delay(8, group[minute])
        }

        let average_graph_data_single = {
          'total_delay':[],
          'ingestion_delay':[],
          'storage_delay':[],
          'time':[]
        };

        let average_graph_data_multi = {
          'total_delay':[],
          'ingestion_delay':[],
          'storage_delay':[],
          'time':[]
        };

        for (const minute of Object.keys(total_delay_single)){
          if (total_delay_single[minute].length!==0){
            average_graph_data_single.total_delay.push(mean(total_delay_single[minute]))
            average_graph_data_single.ingestion_delay.push(mean(ingestion_delay_single[minute]))
            average_graph_data_single.storage_delay.push(mean(storage_delay_single[minute]))
            average_graph_data_single.time.push(minute)
          }
        }
        for (const minute of Object.keys(total_delay_multi)){
          if (total_delay_multi[minute].length!==0){
            average_graph_data_multi.total_delay.push(mean(total_delay_multi[minute]))
            average_graph_data_multi.ingestion_delay.push(mean(ingestion_delay_multi[minute]))
            average_graph_data_multi.storage_delay.push(mean(storage_delay_multi[minute]))
            average_graph_data_multi.time.push(minute)
          }
        }
        set_avg_graph_data({'single_process':average_graph_data_single, 'multi_process':average_graph_data_multi})
      
        let std_total_delay_single=get_std_graph_data(total_delay_single, average_graph_data_single.total_delay)
        let std_total_delay_multi=get_std_graph_data(total_delay_multi, average_graph_data_multi.total_delay)

        let std_ingestion_delay_single=get_std_graph_data(ingestion_delay_single, average_graph_data_single.ingestion_delay)
        let std_ingestion_delay_multi=get_std_graph_data(ingestion_delay_multi, average_graph_data_multi.ingestion_delay)

        let std_storage_delay_single=get_std_graph_data(storage_delay_single, average_graph_data_single.storage_delay)
        let std_storage_delay_multi=get_std_graph_data(storage_delay_multi, average_graph_data_multi.storage_delay)

        set_total_delay_graph_data({"single_process":std_total_delay_single, "multi_process":std_total_delay_multi})
        set_ingestion_delay_graph_data({"single_process":std_ingestion_delay_single, "multi_process":std_ingestion_delay_multi})
        set_storage_delay_graph_data({"single_process":std_storage_delay_single, "multi_process":std_storage_delay_multi})

      });
  },[]);
  

  return (
    <div className="App">
      <Header></Header>
      <GraphTitle title="Average Delay"></GraphTitle>
      <MultiseriesGraph single_data={avg_graph_data.single_process} multi_data={avg_graph_data.multi_process}></MultiseriesGraph>
      <GraphTitle title="Total Delay"></GraphTitle>
      <ConfidenceGraph single_data={total_delay_graph_data.single_process} name = "total" multi_data={total_delay_graph_data.multi_process}></ConfidenceGraph>
      <GraphTitle title="Ingestion Delay"></GraphTitle>
      <ConfidenceGraph single_data={ingestion_delay_graph_data.single_process} name ="ingestion" multi_data={ingestion_delay_graph_data.multi_process}></ConfidenceGraph>
      <GraphTitle title="Storage Delay"></GraphTitle>
      <ConfidenceGraph single_data={storage_delay_graph_data.single_process} name = "storage" multi_data={storage_delay_graph_data.multi_process}></ConfidenceGraph>
      
    </div>
  );
}

export default App;
