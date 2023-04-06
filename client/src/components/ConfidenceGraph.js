import React from "react";
import ReactEcharts from "echarts-for-react";
import {round} from "mathjs"
import "../style_sheets/Graph.css"


function tooltip_formatter(params) {
  let display_series=['Avg', 'Min', 'Max']
  let tooltip = '<p>Time: <b>'+params[0].name +'</b></p>'
  let dev_present = false
  let avg_index = -1 
  let lowconf_index = -1
  for (let i=0; i<params.length;i++){
      
    if (display_series.includes(params[i].seriesName)){
      tooltip+= '<p>'+params[i].marker+" <span class=\"series_name\">"+params[i].seriesName+"</span><b class=\"series_value\">"+round(params[i].value,2)+"s</b></p>"
      if (params[i].seriesName === "Avg")
        avg_index = i
    } 
    
    else if (params[i].seriesName === "Conf -"){
      lowconf_index = i
      tooltip+="<p>"+params[i].value+"</p>"
    }

    else if (params[i].seriesName === "Dev"){
      dev_present = true
      tooltip+="<p>"+params[i].value+"</p>"
    }
    
    
  }
  if (avg_index>=0 && lowconf_index>=0 && dev_present)
    tooltip+= '<p>'+params[lowconf_index].marker+" <span class=\"series_name\">Dev</span><b class=\"series_value\">"+round((params[avg_index].value - params[lowconf_index].value)*2,2)+"s</b></p>"
  
  return tooltip  
}


function ConfidenceGraph(props){
    let solid_line_color
    let conf_color
    if(props.name==="total"){
        solid_line_color = '#0072f0'
        conf_color = "#e6f1ff"
    }
    else if(props.name==="ingestion"){
        solid_line_color = '#4caf50'
        conf_color = "#dcefdd"
    }
    else if(props.name==="storage"){
        solid_line_color = '#f10096'
        conf_color = "#ffb3e0"
    }
    else{
        solid_line_color = '000'
        conf_color = "000"
    }

    if(props.name==='ingestion')
      console.log(props)
    
    
    let single_processs_options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
          label: {
            backgroundColor: '#ccc',
            borderColor: '#aaa',
            borderWidth: 1,
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            color: '#222'
          }
        },
        formatter:tooltip_formatter,
      },
      toolbox: {
        feature: {
          dataZoom: {
            filterMode: "none"
          },
          
        }
      },
      legend: {
        data:['Avg', 'Max', 'Min', 'Dev'],
        left:"5%",
        top:"1.5%",
        textStyle:{ 
            fontWeight:'bolder'
        }
      },
      grid: {
        left: '6.5%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: props.single_data.time,
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Avg',
          type: 'line',
          data: props.single_data.avg,
          itemStyle: {
            color: solid_line_color,
          },
          
        },
        {
          name: 'Max',
          type: 'line',
          data: props.single_data.max,
          itemStyle: {
            color: solid_line_color,
          },
          lineStyle:{
            type: 'dotted'
          },
          showSymbol: false
        },
        {
          name: 'Min',
          type: 'line',
          data: props.single_data.min,
          itemStyle: {
            color: solid_line_color,
          },
          lineStyle:{
            type: 'dotted'
          },
          showSymbol: false
        },
        {
          name: "Conf -",
          type: 'line',
          color: conf_color,
          data: props.single_data.low_conf,
          lineStyle: {
            opacity: 0
          },
          stack: 'confidence-band',
          symbol: 'none'
        },
        {
          name: 'Dev',
          type: 'line',
          data: props.single_data.upper_conf.map((element, index)=>element-props.single_data.low_conf[index]),
          color: conf_color,
          lineStyle: {
            opacity: 0
          },
          areaStyle: {
            color: conf_color
          },
          stack: 'confidence-band',
          symbol: 'none'
        },
      ]
    }
      
    let multi_processs_options = JSON.parse(JSON.stringify(single_processs_options))
    multi_processs_options.series[0].data=props.multi_data.avg
    multi_processs_options.series[1].data=props.multi_data.max
    multi_processs_options.series[2].data=props.multi_data.min
    multi_processs_options.series[3].data=props.multi_data.low_conf
    multi_processs_options.series[4].data=props.multi_data.upper_conf.map((element, index)=>element-props.multi_data.low_conf[index])
    multi_processs_options.xAxis.data=props.multi_data.time
    multi_processs_options.tooltip.formatter=tooltip_formatter
    
    let style={height:"500px"}

    return (
      <div>
          <div className="graph_container left_graph_container" id="single_process_graph">
          <ReactEcharts option={single_processs_options} className="echart_graph_container"></ReactEcharts>
          </div>
          <div className="graph_container" id="multi_process_graph">
          <ReactEcharts option={multi_processs_options} className="echart_graph_container"></ReactEcharts>
          </div>
      </div>
        
    )

}

export default ConfidenceGraph;