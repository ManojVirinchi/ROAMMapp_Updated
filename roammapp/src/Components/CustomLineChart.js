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

function CustomLineChart({legends=[],chart_title="",data=[],labels=[]}){


  const [startIndex, setStartIndex] = useState(0);
  const maxPoints = 50;

  const handleSliderChange = (event) => {
    setStartIndex(parseInt(event.target.value, 10));
  };

  const filteredLabels = labels.slice(startIndex, startIndex + maxPoints);
  const filteredData = data.map(dataset => dataset.slice(startIndex, startIndex + maxPoints));



    
    const colors =  ['rgba(79, 119, 170, 1), rgba(255, 165, 0,1)','rgba(255, 99, 132,1)', 'rgba(255, 205, 86,1)','rgba(75, 192, 192,1)', 'rgba(54, 162, 235,1)', 'rgba(153, 102, 255,1)', 'rgba(231,233,237,1)'];


    const final_data = filteredData.map((data, index) => {
        return {
          label: legends[index],
          data: data,
          fill: false,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length],
          pointRadius: 1
        };
      });
    
      const chart_data = {
        labels: filteredLabels,
        datasets: final_data
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
    



    // const final_data = data.map( (data,index) => {
    //     const temp_data = {
    //             label:legends[index] ,
    //             data: data,
    //             fill: false,
    //             borderColor: colors[index%colors.length],
    //             backgroundColor: colors[index%colors.length],
    //             pointRadius: 1
    //     }
    //     return temp_data
    // })
    
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
        <div style={{ overflow: "auto",height:"100%", width:"100%",background:"transparent", padding:"24px"}} >
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


export default CustomLineChart;




// {
  
//     data: {
//       labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99],
//       datasets: [{
//         label: 'Users',
//         fill:false,
//         data: [12, 37, 40, 30, 19, 17, 89, 17, 46, 37, 36, 52, 45, 95, 32, 72, 40, 21, 84, 13, 91, 44, 28, 38, 16, 70, 81, 38, 60, 99, 62, 84, 66, 39, 77, 15, 81, 76, 3, 16, 16, 83, 56, 5, 3, 3, 43, 6, 90, 93, 81, 19, 17, 19, 71, 21, 27, 63, 43, 37, 88, 76, 20, 52, 50, 95, 9, 94, 99, 42, 16, 2, 26, 100, 77, 34, 18, 89, 99, 3, 1, 57, 59, 61, 34, 44, 84, 30, 45, 51, 9, 67, 31, 80, 76, 59, 49, 70, 44, 58]
//       }]
//     },
//     options: {
//                   elements: {
//                       point:{
//                           radius: 0
//                       }
//                   }
//               }
//   }