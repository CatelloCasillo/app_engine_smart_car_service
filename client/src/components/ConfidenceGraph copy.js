import React from "react";
import ReactEcharts from "echarts-for-react";
import "../style_sheets/Graph.css"

function ConfidenceGraph(props){
    console.log(props.name)
    console.log(props.single_data)
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

    var base = -props.single_data.reduce(function (min, val) {
        return Math.floor(Math.min(min, val.low_conf));
    }, Infinity);

      const options=
      {
        legend: {
            orient:'horizontal',
            top:'top',
            left:'60',
            textStyle: {
                fontWeight:'bolder'
            }
        },
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
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: props.single_data.map(function (item) {
            return item.time;
          }),
          //data: props.single_data.time,
          boundaryGap: false
        },
        yAxis: {
          type:'value'
        },
        series: [
          {
            name:"avg",
            type: 'line',
            //data: props.single_data.avg,
            data: props.single_data.map(function (item) {
                return item.avg + base;
            }),
            itemStyle: {
                color: solid_line_color
            },
            showSymbol: false
          },
          {
            name:"min",
            type: 'line',
            data: props.single_data.min,
            itemStyle: {
              color: solid_line_color
            },
            showSymbol: false
          },
          {
            name:"max",
            type: 'line',
            data: props.single_data.max,
            itemStyle: {
              color: solid_line_color
            },
            showSymbol: false
          },
          {
            name: 'conf +',
            type: 'line',
            //data: props.single_data.upper_conf,
            data: props.single_data.map(function (item) {
                return item.upper_conf - item.low_conf;
            }),
            //data: [2,5],
            color: conf_color,
            lineStyle: {
              opacity: 0
            },
            stack: 'avg',
            symbol: 'none',
            showSymbol: false
          },
          {
            name: 'conf -',
            type: 'line',
            color: conf_color,
            //data: [1,3],
            data:props.single_data.map(function (item) {
                return item.low_conf + base;
            }),
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              color: conf_color
            },
            stack: 'avg',
            showSymbol: false,
            symbol: 'none'
          },
        ]
      }

      console.log(options.series[4].data)

      let options2 = JSON.parse(JSON.stringify(options))
      options2.series[0].data=props.multi_data.avg
      options2.series[1].data=props.multi_data.min
      options2.series[2].data=props.multi_data.max
      options2.series[3].data=props.multi_data.upper_conf
      options2.series[4].data=props.multi_data.low_conf
      options2.xAxis.data=props.multi_data.time

      return (
        <div>
            <div className="prova_graph" id="single_process_graph">
            <ReactEcharts option={options}></ReactEcharts>
            </div>
            <div className="prova_graph" id="multi_process_graph">
            <ReactEcharts option={options2}></ReactEcharts>
            </div>
        </div>
         
        )

}

export default ConfidenceGraph;