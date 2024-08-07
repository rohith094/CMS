import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import 'tailwindcss/tailwind.css';
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Cookies from 'js-cookie';

Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Welcomepage = () => {
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranchwiseData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin/allstudents/branchwise', {
          headers: {
            'Authorization': `${Cookies.get('admintoken')}`
          }
        });
        setBranchData(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBranchwiseData();
  }, []);

  const getChartData = () => {
    const labels = branchData.map(branch => branch.branch);
    const data = branchData.map(branch => branch.count);

    return {
      labels,
      datasets: [
        {
          label: 'Number of Students',
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh' }} className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Branchwise Student Distribution</h1>

      <div style={{ background: "#1A2438", color: 'white' }} className="from-blue-500 to-green-500 p-6 rounded-lg shadow-md mt-4">
        <h2 className="text-xl font-bold mb-4 text-white">Student Count by Branch</h2>
        <ul className="space-y-2">
          {branchData.map(branch => (
            <li key={branch.branch} className="bg-white p-3 rounded-lg shadow-md flex justify-between items-center">
              <span className="font-bold text-gray-700">{branch.branch}</span>
              <span className="text-gray-700">{branch.count} students</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Number of Students</h2>
          <Pie data={getChartData()} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Student Distribution</h2>
          <div style={{ width: '100%', height: '400px' }}>
            <Bar data={getChartData()} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcomepage;
