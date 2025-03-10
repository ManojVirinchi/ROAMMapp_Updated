import React,{useState,useRef,useEffect} from 'react'
import {Line} from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
  );

function GpsGraph({legends=[],chart_title="",data=[],labels=[]}){
    const [startIndex, setStartIndex] = useState(0);
    const maxPoints = 50;
  
    const handleSliderChange = (event) => {
      setStartIndex(parseInt(event.target.value, 10));
    };
  
    const filteredLabels = labels.slice(startIndex, startIndex + maxPoints);
    const filteredLatitudes = data.length > 0 ? data[0].slice(startIndex, startIndex + maxPoints) : [];
    const filteredLongitudes = data.length > 0 ? data[1].slice(startIndex, startIndex + maxPoints) : [];
  
    
    const lat_data = {
        label: "Latitude",
        data: filteredLatitudes,
        fill: false,
        borderColor: "rgba(79, 119, 170, 1)",
        backgroundColor: "rgba(79, 119, 170, 1)",
        pointRadius: 1
      };
      const long_data = {
        label: "Longitude",
        data: filteredLongitudes,
        fill: false,
        borderColor: "rgba(255, 165, 0,1)",
        backgroundColor: "rgba(255, 165, 0,1)",
        pointRadius: 1
      };
    
      const chart_data = {
        labels: filteredLabels,
        datasets: [lat_data, long_data]
      };
    
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: chart_title,
            font: {
              size: 20,
              weight: "bold",
            },
            color: "black"
          },
          legend: {
            labels: {
              color: "black"
            }
          },
          zoom: {
            zoom: {
              enabled: true,
              mode: 'x',
              speed: 0.1,
              drag: true
            },
            pan: {
              enabled: true,
              mode: 'x',
              speed: 20,
              threshold: 10
            }
          },
          elements: {
            point: {
              radius: 0
            }
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                const value = tooltipItem.raw;
                return `Value: ${value.toFixed(15)}`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'category',
            grid: {
              color: "rgba(0,0,0,0.2)",
            },
            ticks: {
              color: "black",
              weight: "bold"
            },
            min: 0,
            max: maxPoints - 1
          },
          y: {
            grid: {
              color: "rgba(0,0,0,0.2)",
            },
            ticks: {
              color: "black",
              weight: "bold"
            }
          }
        }
      };
      
    
    // var latitudes = data.length > 0? data[0]:[]
    // var longitude = data.length > 0? data[1]:[]
    // var lat_data = {
    //             label:"Latitude" ,
    //             data: latitudes,
    //             fill: false,
    //             borderColor: "rgba(79, 119, 170, 1)" ,
    //             backgroundColor: "rgba(79, 119, 170, 1)",
    //             pointRadius: 1
    // }
    // var long_data = {
    //             label:"Longitude" ,
    //             data: longitude,
    //             fill: false,
    //             borderColor: "rgba(255, 165, 0,1)" ,
    //             backgroundColor: "rgba(255, 165, 0,1)",
    //             pointRadius: 1
    // }
    // const final_data = [lat_data,long_data]
    
    // const chart_data = {
    //     labels: labels,
    //     datasets: final_data
    // }
    
    // const options = {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     plugins:{
    //         title:{
    //             display: true,
    //             text: chart_title,
    //             font:{
    //                 size: 20,
    //                 weight:"bold",
    //             },
    //             color:"black"
    //         },
    //         legend:{
    //             labels:{
    //                 color:"black"
    //             }
    //         },
    //         zoom: {
    //             zoom: {
    //                 enabled: true,
    //                 mode: 'x',
    //                 speed: 0.1,
    //                 drag: true

    //             },
    //             pan:{
    //                 enabled: true,
    //                 mode: 'x',
    //                 speed: 20,
    //                 threshold: 10
    //             }
    //           },

    //           elements: {
    //             point:{
    //                 radius: 0
    //             }
    //         }
    //     },
    //     scales:{
    //         x:{
    //             type: 'category',
                
    //             grid:{
    //                 color: "rgba(0,0,0,0.2)",
                    
    //             },
    //             ticks:{
    //                 color: "black",
    //                 weight:"bold"

    //             },
    //             min: 0,
    //             max: 50
    //         },
    //         y:{
    //             grid:{
    //                 color:"rgba(0,0,0,0.2)",
                    
    //             },
    //             ticks:{
    //                 color: "black",
    //                 weight:"bold"
    //             }
    //         }
    //     }
        
    // }

    useEffect(() => {
        setStartIndex(0); // Reset the start index when data or labels change
      }, [data, labels]);

    return(
        <div style={{ overflow: "hidden",height:"100%", width:"100%",background:"transparent",padding:"18px"}} >
            <Line data={chart_data} options={options}/>

            <input
        type="range"
        min="0"
        max={labels.length - maxPoints}
        value={startIndex}
        onChange={handleSliderChange}
        step="1"
        style={{ width: "100%" }}
      />

        </div>
    );
}


export default GpsGraph;


