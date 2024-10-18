
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Assuming you are using cookies for auth
import { toast } from "react-toastify";

const PromoteStudents = () => {
  const token = Cookies.get("admintoken");
  const { semesternumber } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promoteLoading, setPromoteLoading] = useState(false);
  const [error, setError] = useState("");

  // Group students by branch
  const groupStudentsByBranch = (students) => {
    return students.reduce((groups, student) => {
      const { branchshortcut } = student;
      if (!groups[branchshortcut]) {
        groups[branchshortcut] = [];
      }
      groups[branchshortcut].push(student);
      return groups;
    }, {});
  };

  // Fetch students by semester
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `http://localhost:3001/admin/studentbysemester/${semesternumber}`,
          {
            headers: {
              Authorization: `${token}`, // Assuming token-based authentication
            },
          }
        );
        const groupedStudents = groupStudentsByBranch(response.data.students);
        setStudents(groupedStudents);
      } catch (err) {
        setError("Failed to fetch students");
      }
      setLoading(false);
    };

    fetchStudents();
  }, [semesternumber]);

  // Promote students
  const handlePromote = async () => {
    setPromoteLoading(true);
    setError("");
    try {
      await axios.post(
        `http://localhost:3001/admin/promotestudents/${semesternumber}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      toast.success("Students promoted successfully");
      navigate(-1);
    } catch (err) {
      toast.error("Failed to promote students");
    }
    setPromoteLoading(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Promote Students for Semester {semesternumber}
        </h1>
        <button
          onClick={handlePromote}
          className={`px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all ${
            promoteLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={promoteLoading}
        >
          {promoteLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Promoting...
            </div>
          ) : (
            "Promote Students"
          )}
        </button>
      </div>

      {loading ? (
        <div className="mt-4 text-center text-lg text-gray-500">
          Loading students...
        </div>
      ) : error ? (
        <div className="mt-4 text-red-500">{error}</div>
      ) : (
        <div className="mt-4">
          {Object.keys(students).length === 0 ? (
            <p className="text-gray-700">
              No active students found for this semester.
            </p>
          ) : (
            Object.keys(students).map((branchshortcut, index) => (
              <div key={index} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {branchshortcut}
                  </h2>
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full shadow">
                    {students[branchshortcut].length} Students
                  </span>
                </div>

                <table className="w-full table-auto shadow-md rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-200 text-left text-sm leading-normal text-gray-600 uppercase">
                      <th className="px-6 py-3">Registration ID</th>
                      <th className="px-6 py-3">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students[branchshortcut].map((student, i) => (
                      <tr
                        key={student.registrationid}
                        className={`${
                          i % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-6 py-4 text-gray-700">
                          {student.registrationid}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {student.nameasperssc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PromoteStudents;
