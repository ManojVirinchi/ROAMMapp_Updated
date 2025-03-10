import React, { useState,PureComponent, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Brush,
    AreaChart,
    Area,
    ResponsiveContainer,
  } from 'recharts';

  function LineChartCustom({legends=[],chart_title="",data=[],labels=[]}) {
   
      let final_data = data[0].map((d,ind) => {
        const temp = {date: labels[ind],
          value: d
        }
        return temp
      })

      const CustomizedAxisTick = (props) => {
        const { x, y, payload } = props;
      
        return (
          <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontSize={12}>
              {payload.value}
            </text>
          </g>
        );
      };
      
    
  
    let start_index = 0;
    let end_index = Math.min(29, data[0].length-1)
    return(
        <div style={{ overflow: "auto",height:"100%", width:"100%",background:"transparent"}} >
            <ResponsiveContainer width="100%">
          <LineChart
            data={final_data}
            syncId="anyId"
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={CustomizedAxisTick} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="rgba(79, 119, 170, 1)" fill="rgba(79, 119, 170, 1)" />
            <Brush startIndex={start_index} endIndex={end_index}/>
          </LineChart>
        </ResponsiveContainer>
        </div>
    )
  }

  export default LineChartCustom;