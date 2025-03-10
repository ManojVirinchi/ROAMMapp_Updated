import React from 'react'
import {Line} from 'react-chartjs-2'
import 'chart.js/auto'
import 'chartjs-plugin-zoom'
function DashboardChart({legends="",chart_title="",data=[],labels=[]}){
  const colors =  ['rgba(79, 119, 170, 1), rgba(255, 165, 0,1)','rgba(255, 99, 132,1)', 'rgba(255, 205, 86,1)','rgba(75, 192, 192,1)', 'rgba(54, 162, 235,1)', 'rgba(153, 102, 255,1)', 'rgba(231,233,237,1)']; 
  const final_data = data.map( (data,index) => {
        const temp_data = {
                label:legends[index] ,
                data: data,
                fill: false,
                borderColor: "rgba(75, 120, 192, 0.5)",
                borderColor: colors[index%colors.length],
                backgroundColor: colors[index%colors.length]
            }

            return temp_data     
        })
    const chart_data = {
        labels: labels,
        datasets: final_data

    }
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
            title:{
                display: true,
                text: chart_title,
                font:{
                    size: 20,
                    weight:"bold",
                },
                color:"black"
            },
            legend:{
                labels:{
                    color:"black"
                }
            },
            zoom: {
                zoom: {
                    enabled: true,
                    mode: 'x',
                    speed: 0.1,
                    drag: true

                },
                pan:{
                    enabled: true,
                    mode: 'x',
                    speed: 20,
                    threshold: 10
                }
              },
        },
        scales:{
            x:{
                grid:{
                    color: ""
                },
                ticks:{
                    color: "",
                    weight:""

                },
                min: 0,
                max: 20
            },
            y:{
                grid:{
                    color:"black"
                },
                ticks:{
                    color: "black",
                    weight:"bold"
                }
            }
        }
        
    }
    return(
        <div style={{height:"100%", width:"100%",background:"transparent"}} >
            <Line data={chart_data} options={options}/>
        </div>
    );
}


export default DashboardChart;