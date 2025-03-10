import React from 'react';
import { Bar } from 'react-chartjs-2';

// const data = {
//   labels: ['No Pain', 'Low', 'Medium', 'High', 'Extreme'],
//   datasets: [
//     {
//       label: 'Bar Chart',
//       data: [6, 7, 4, 4, 2], // Data for the bars
//       backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
//       borderColor: 'rgba(75, 192, 192, 1)', // Border color
//       borderWidth: 1, // Border width
//     },
//   ],
// };

const options = {
    plugins:{
        title:{
            display: true,
            text: "",
            font:{
                size: 20,
                weight:"bold",
            },
            color:"black"
        },
    },
  scales: {
    x:{
      grid:{
        color: "rgba(0,0,0,0.2)",
        
    },
    },
    y: {
      grid:{
        color: "rgba(0,0,0,0.2)",
        
    },
      beginAtZero: true,
    },
  },
};

const DescreteBarChart = ({binLabel,labels,data}) => {
  return (
    <div>
      <Bar data={{
  labels: labels,
  datasets: [
    {
      label: binLabel,
      data: data, // Data for the bars
      backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
      borderColor: 'rgba(75, 192, 192, 1)', // Border color
      borderWidth: 1, // Border width
    },
  ],
}} options={options} />
    </div>
  );
};

export default DescreteBarChart;
