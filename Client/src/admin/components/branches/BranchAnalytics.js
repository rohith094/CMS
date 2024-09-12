import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Cookies from 'js-cookie';

const BranchAnalytics = () => {
  const { branchcode } = useParams();
  const [branchDetails, setBranchDetails] = useState({});
  const [courseCounts, setCourseCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const token = Cookies.get('admintoken');

  useEffect(() => {
    const fetchBranchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/branchname/${branchcode}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setBranchDetails(response.data);
      } catch (error) {
        console.error('Error fetching branch details:', error);
      }
    };
    const fetchCourseCounts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/course-count/${branchcode}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setCourseCounts(response.data);
      } catch (error) {
        console.error('Error fetching course counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchDetails();
    fetchCourseCounts();
  }, [branchcode]);

  const courseTypeData = {
    labels: ['Lectures', 'Practicals', 'Integrated'],
    datasets: [
      {
        label: 'Course Type Counts',
        data: [
          courseCounts.lectureCount || 0,
          courseCounts.practicalCount || 0,
          courseCounts.integratedCount || 0,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', 
          'rgba(54, 162, 235, 0.6)', 
          'rgba(255, 206, 86, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', 
          'rgba(54, 162, 235, 1)', 
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Course Types',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Courses',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '100vh', overflowY: 'scroll' }} className="downscroll container mx-auto p-6">
      <div className="bg-white  rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Branch Details</h2>
        <table className="min-w-full text-left text-gray-700">
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="py-2 pr-4 text-gray-800 font-semibold">Branch Code:</th>
              <td className="py-2">{branchDetails.branchcode}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="py-2 pr-4 text-gray-800 font-semibold">Branch Name:</th>
              <td className="py-2">{branchDetails.branchname}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="py-2 pr-4 text-gray-800 font-semibold">HOD Name:</th>
              <td className="py-2">{branchDetails.hodname}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="py-2 pr-4 text-gray-800 font-semibold">Block Number:</th>
              <td className="py-2">{branchDetails.blocknumber}</td>
            </tr>
            <tr>
              <th className="py-2 pr-4 text-gray-800 font-semibold">Branch Shortcut:</th>
              <td className="py-2">{branchDetails.branchshortcut}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden"></span>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Course Type Distribution</h2>
            <div className="h-64">
              <Bar data={courseTypeData} options={options} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BranchAnalytics;
