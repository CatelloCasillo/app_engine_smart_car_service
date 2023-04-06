import React from "react";
import ReactEcharts from "echarts-for-react";
import "../style_sheets/Graph.css"
import {round} from 'mathjs';

function tooltip_formatter(params) {
  let tooltip = '<p>Time: <b>'+params[0].name+'</b></p>'
  for (let i=0; i<params.length;i++)
      tooltip+= '<p>'+params[i].marker+" <span class=\"series_name\">"+params[i].seriesName+"</span><b class=\"series_value\">"+round(params[i].value,2)+"</b></p>"
  return '<div>'+tooltip+'</div>'  
}


function MultiSeriesGraph(props){
  
  const multi_options ={
      xAxis: {
        type:'category',
        data: props.multi_data.time
      },
      grid: {
        left: '6.5%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      yAxis: {
        type:'value'
      },
      toolbox: {
        feature: {
          dataZoom: {
            filterMode: "none"
          },
          
        }
      },
      series: [
        {
          name: "Total (s)",
          data: props.multi_data.total_delay,
          type: 'line',
          
          color: '#0072f0'
        },
        {
          name: "Ingestion (s)",
          data: props.multi_data.ingestion_delay,
          type: 'line',
          
          color: '#4caf50'
        },
        {
          name: "Storage (s)",
          data: props.multi_data.storage_delay,
          type: 'line',
          
          color: '#f10096'
        }
      ],
      legend:{
        data:['Total (s)','Ingestion (s)','Storage (s)'],
        left:"5%",
        top:"1.5%",
        textStyle: {
          fontWeight:'bolder'
        }
      },
      tooltip: {
        trigger: 'axis',
        confine: true,
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
        formatter:tooltip_formatter
        
      },
  }

  var single_options=JSON.parse(JSON.stringify(multi_options))
  single_options.series[0].data = props.single_data.total_delay
  single_options.series[1].data = props.single_data.ingestion_delay
  single_options.series[2].data = props.single_data.storage_delay
  single_options.xAxis.data = props.single_data.time
  single_options.tooltip.formatter=tooltip_formatter


  return (
      <div>
          <div className="graph_container left_graph_container" id="single_process_graph">
          <ReactEcharts option={single_options} className="echart_graph_container"></ReactEcharts>
          </div>
          <div className="graph_container" id="multi_process_graph">
          <ReactEcharts option={multi_options} className="echart_graph_container"></ReactEcharts>
          </div>
      </div>   
      )
}



export default MultiSeriesGraph;