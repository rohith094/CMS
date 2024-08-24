import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Cookies from 'js-cookie'; // Necessary for using react-chartjs-2 with Chart.js v3

const Welcomepage = () => {
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const admintoken = Cookies.get('admintoken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin/student-analytics', {
          headers: {
            Authorization: `${admintoken}`
          }
        });
        const { barGraphData, lineGraphData } = response.data;

        // Prepare data for Bar Chart
        const barChartLabels = Object.keys(barGraphData);
        const maleCounts = barChartLabels.map(year => barGraphData[year].male);
        const femaleCounts = barChartLabels.map(year => barGraphData[year].female);

        setBarData({
          labels: barChartLabels,
          datasets: [
            {
              label: 'Male',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              data: maleCounts,
            },
            {
              label: 'Female',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              data: femaleCounts,
            },
          ],
        });

        // Prepare data for Line Chart
        const lineChartLabels = Object.keys(lineGraphData);
        const studentCounts = lineChartLabels.map(year => lineGraphData[year]);

        setLineData({
          labels: lineChartLabels,
          datasets: [
            {
              label: 'Total Students',
              fill: false,
              borderColor: 'rgba(75, 192, 192, 1)',
              data: studentCounts,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching student analytics:', error);
      }
    };

    fetchData();
  }, [admintoken]);

  return (
    <div style={{height : '85vh', overflowY : 'scroll'}} className="p-3 downscroll">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Student Analytics Dashboard</h1>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Yearly Student Enrollment</h2>
        {lineData ? (
          <Line data={lineData} options={{ responsive: true }} />
        ) : (
          <p>Loading line chart...</p>
        )}
      </div>

      <div className="mb-3">
        <h2 className="text-2xl font-semibold mb-4">Gender Distribution (Last 5 Years)</h2>
        {barData ? (
          <Bar data={barData} options={{ responsive: true }} />
        ) : (
          <p>Loading bar chart...</p>
        )}
      </div>

    </div>
  );
};

export default Welcomepage;
