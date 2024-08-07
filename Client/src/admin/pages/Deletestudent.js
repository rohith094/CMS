// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { toast } from 'react-toastify';

// const Deletestudent = () => {
//   const { jntuno } = useParams();
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const admintoken = Cookies.get('admintoken');

//   const navigate = useNavigate();
//   useEffect(() => {
//     const fetchStudent = async () => {

//       try {
//         const response = await axios.get(`http://localhost:3001/admin/singlestudent/${jntuno}`,{
//           headers: {
//             'Authorization': `${admintoken}`
//           }
//         });
//         console.log(response);
//         setStudent(response.data);
//       } catch (error) {
//         setError(error.response ? error.response.data : 'An error occurred');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudent();
//   }, [jntuno]);

//   const DeleteStudent = async (req,res)=>{
//     try{
//       const response = await axios.delete(`http://localhost:3001/admin/deletestudent`, {
//         headers: {
//           'Authorization': `${admintoken}`
//         },
//         data: {
//           jntuno: student.jntuno
//         }
//       });

//       if(response.status === 200){
//         toast.info(`student with ${student.jntuno} is deleted`);
//         navigate('/admin/studentsdata/viewstudents');
//       }
//     }catch(error){
//       toast.error('An error occured');
//     }
//   }
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Student Data</h1>
//       {student && (
//         <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
//           <img
//             src={student.imageurl}
//             alt={`${student.firstname} ${student.lastname}`}
//             style={{width : '160px', height : '160px', borderRadius : '5px'}}
//           />
//           <div className="text-sm">
//             <p><strong>JNTU No:</strong> {student.jntuno}</p>
//             <p><strong>First Name:</strong> {student.firstname}</p>
//             <p><strong>Last Name:</strong> {student.lastname}</p>
//             <p><strong>Email:</strong> {student.email}</p>
//             <p><strong>Password:</strong> Can't visible</p>
//             <p><strong>Branch:</strong> {student.branch}</p>
//             <p><strong>Joining Year:</strong> {student.joiningyear}</p>
//             <p><strong>Current Year:</strong> {student.currentyear}</p>
//             <button
//             type="submit"
//             style={{ background: "#1A2438" }}
//             className="p-2 text-white rounded-md w-full"
//             onClick={DeleteStudent}
//           >
//             Delete Student
//           </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Deletestudent;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const Deletestudent = () => {
  const { jntuno } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const admintoken = Cookies.get('admintoken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/singlestudent/${jntuno}`, {
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
  }, [jntuno, admintoken]);

  const deleteStudent = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/admin/deletestudent`, {
        headers: {
          'Authorization': `${admintoken}`
        },
        data: {
          jntuno: student.jntuno
        }
      });

      if (response.status === 200) {
        toast.info(`Student with JNTU No: ${student.jntuno} is deleted`);
        navigate('/admin/studentsdata/viewstudents');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  }

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
    <div className="relative flex bg-clip-border rounded-xl bg-white text-gray-700 w-full max-w-[48rem] flex-row mx-auto my-8">
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        className="relative w-2/5 m-0 overflow-hidden text-gray-700 bg-white rounded-r-none bg-clip-border rounded-xl shrink-0"
      >
        <img
          style={{ width: '75%', height: '75%', borderRadius: '8px' }}
          src={student?.imageurl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1471&amp;q=80"}
          alt={`${student?.firstname || 'Student'} ${student?.lastname || ''}`}
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <table className="min-w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <tbody>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">JNTU No:</td>
              <td className="px-4 py-2">{student.jntuno}</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">First Name:</td>
              <td className="px-4 py-2">{student.firstname}</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">Last Name:</td>
              <td className="px-4 py-2">{student.lastname}</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">Email:</td>
              <td className="px-4 py-2">{student.email}</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">Password:</td>
              <td className="px-4 py-2">Can't visible</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">Branch:</td>
              <td className="px-4 py-2">{student.branch}</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">Joining Year:</td>
              <td className="px-4 py-2">{student.joiningyear}</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 font-bold">Current Year:</td>
              <td className="px-4 py-2">{student.currentyear}</td>
            </tr>
          </tbody>
        </table>
        <button
          onClick={deleteStudent}
          className="mt-4 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 w-full"
        >
          Delete Student
        </button>
      </div>
    </div>
  );
};

export default Deletestudent;

