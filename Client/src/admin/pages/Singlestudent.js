
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const Singlestudent = () => {
  const { registrationid } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const admintoken = Cookies.get('admintoken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/student/${registrationid}`, {
          headers: {
            'Authorization': `${admintoken}`
          }
        });
        setStudent(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [registrationid, admintoken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return toast.error('An error occurred');
  }

  const handleBack = () => {
    navigate('/admin/admissions/viewadmissions');
  };

  return (
    <div style={{ height: '85vh', overflowY: 'scroll' }} className="downscroll relative  flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 w-full max-w-[48rem] flex-row mx-auto my-8">
      <div
        style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}
        className=" overflow-hidden text-gray-700 bg-white rounded-r-none bg-clip-border rounded-xl shrink-0"
      >
        <img
          style={{ width: '250px', borderRadius: '8px', }}
          src={student.imgurl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1471&amp;q=80"}
          alt={`${student.nameasperssc || 'Student'}`}
          className="object-cover"
        />

        <div>
          <table className="min-w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <tbody>

              <tr className="border-b border-gray-200 dark:border-gray-600">
                <td className="px-4 py-2 font-bold">
                  <b>ApplicationNumber:</b>
                </td>
                <td className="px-4 py-2">{student.applicationnumber}</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <td className="px-4 py-2 font-bold">
                  <b>Registrationid:</b>
                </td>
                <td className="px-4 py-2">{student.registrationid}</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <td className="px-4 py-2 font-bold">
                  <b>NameasperSSC:</b>
                </td>
                <td className="px-4 py-2">{student.nameasperssc}</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <td className="px-4 py-2 font-bold">
                  <b>JoiningYear:</b>
                </td>
                <td className="px-4 py-2">{student.joiningyear}</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <td className="px-4 py-2 font-bold">
                  <b>Email:</b>
                </td>
                <td className="px-4 py-2">{student.personalemail}</td>
              </tr>

            </tbody>

          </table>
          <button
            style={{ width: '400px' }}
            onClick={handleBack}
            className="mt-4 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </div>
      <div className="p-6">
        <table className="min-w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <tbody>
            {Object.entries(student)
              .filter(([key]) => key !== 'studentpassword' && key !== 'stdid' && key !== 'applicationnumber') // Filter out the studentpassword key
              .map(([key, value]) => {
                // Check if the key is 'joiningdate' and format the value if it is
                if (key === 'joiningdate') {
                  value = new Date(value).toLocaleDateString(); // Format the timestamp to only show the date
                }

                return (
                  <tr key={key} className="border-b border-gray-200 dark:border-gray-600">
                    <td style={{ textTransform: 'capitalize' }} className="px-4 py-2 font-bold">
                      {key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-2">{value || 'N/A'}</td>
                  </tr>
                );
              })}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Singlestudent;
