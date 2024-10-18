
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
// import ReactTooltip from 'react-tooltip'; // Importing ReactTooltip
import { Tooltip } from "react-tooltip";

const ViewSemester = () => {
  const { semesternumber } = useParams();
  const navigate = useNavigate();
  const [loadingSemester, setLoadingSemester] = useState(false);
  const [semesterActive, setSemesterActive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [semesterDetails, setSemesterDetails] = useState(null);
  const [studentCounts, setStudentCounts] = useState([]);

  useEffect(() => {
    fetchSemesterDetails();
  }, [semesternumber]);

  const fetchSemesterDetails = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("admintoken");
      const response = await axios.get(
        `http://localhost:3001/admin/semester/${semesternumber}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setSemesterDetails(response.data);
      setSemesterActive(response.data.semesteractive);
      fetchStudentCounts(response.data.semesternumber);
    } catch (error) {
      console.error("Error fetching semester details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentCounts = async (semesternumber) => {
    try {
      const token = Cookies.get("admintoken");
      const response = await axios.get(
        `http://localhost:3001/admin/studentcount/${semesternumber}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setStudentCounts(response.data);
    } catch (error) {
      console.error("Error fetching student counts:", error);
    }
  };

  const toggleActive = async () => {
    setLoadingSemester(true);
    try {
      const token = Cookies.get("admintoken");
      await axios.put(
        `http://localhost:3001/admin/managesemester/${semesternumber}`,
        { semesteractive: !semesterActive },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setSemesterActive((prevStatus) => !prevStatus);
    } catch (error) {
      console.error("Error toggling semester status:", error);
    } finally {
      setLoadingSemester(false);
    }
  };

  const promoteStudents = () => {
    navigate(`promotestudents`);
  };

  const EditSemesterfun = () => {
    navigate(`editsemester`);
  };

  // Format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Semester Details</h2>
        <div className="flex space-x-4">
          <button
            onClick={EditSemesterfun}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Edit Semester
          </button>
          <button
            className={`bg-${semesterActive ? "red" : "green"}-500 hover:bg-${
              semesterActive ? "red" : "green"
            }-700 text-white py-2 px-4 rounded`}
            onClick={toggleActive}
          >
            {semesterActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading semester details...</p>
      ) : semesterDetails ? (
        <div>
          {/* Semester Details Table */}
          <div className="shadow-lg rounded-lg overflow-hidden mb-6">
            <table className="min-w-full bg-white border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="px-6 py-4 font-bold">Semester Number:</td>
                  <td className="px-6 py-4">
                    {semesterDetails.semesternumber}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-bold">Semester Name:</td>
                  <td className="px-6 py-4">{semesterDetails.semestername}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-bold">Start Date:</td>
                  <td className="px-6 py-4">
                    {formatDate(semesterDetails.startdate)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-bold">End Date:</td>
                  <td className="px-6 py-4">
                    {formatDate(semesterDetails.enddate)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-bold">Batch Year:</td>
                  <td className="px-6 py-4">{semesterDetails.batchyear}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-bold">Status:</td>
                  <td className="px-6 py-4">
                    {semesterActive ? "Active" : "Inactive"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Student Count Cards */}
          <h3 className="text-xl font-bold mb-2">Student Count by Branch</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {studentCounts.length > 0 ? (
              studentCounts.map((branch) => (
                <div
                  key={branch.branchshortcut}
                  className="bg-white p-6 shadow-lg rounded-lg border border-gray-200"
                >
                  <h4 className="text-lg font-bold text-gray-700 mb-2">
                    {branch.branchshortcut}
                  </h4>
                  <p className="text-2xl font-semibold text-blue-500">
                    {branch.studentCount}
                  </p>
                </div>
              ))
            ) : (
              <p>No student data available</p>
            )}
          </div>

          {/* Promote Button */}
          <div className="flex justify-center mt-6">
            <button
              id="tooltip-button" // Unique ID for the tooltip
              className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded w-96 h-12"
              onClick={promoteStudents}
            >
              Promote Students
            </button>
            <Tooltip
              anchorId="tooltip-button" // Anchor it to the button
              content="Note:Before promoting the students deactive all the students who are detained." // Tooltip text
              place="top" // Position the tooltip above the button (you can change this to 'bottom', 'left', or 'right')
            />
          </div>
        </div>
      ) : (
        <p>Semester not found</p>
      )}
    </div>
  );
};

export default ViewSemester;
