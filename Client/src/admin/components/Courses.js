// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import axios from 'axios';
// import { FaRegEdit } from 'react-icons/fa';
// import { MdOutlineDeleteOutline } from 'react-icons/md';
// import { toast } from 'react-toastify';

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingCourse, setLoadingCourse] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     setLoading(true);
//     try {
//       const token = Cookies.get('admintoken');
//       const response = await axios.get('http://localhost:3001/admin/courses', {
//         headers: {
//           Authorization: `${token}`,
//         },
//       });
//       setCourses(response.data);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (courseID) => {
//     navigate(`editcourse/${courseID}`);
//   };

//   const handleDelete = async (coursecode) => {
//     console.log(coursecode);
//     setLoadingCourse(coursecode);
//     try {
//       const token = Cookies.get('admintoken');
//       await axios.delete(`http://localhost:3001/admin/course/${coursecode}`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//       });
//       toast.info("course deleted successfully");
//       fetchCourses();
//     } catch (error) {
//       console.error('Error deleting course:', error);
//     } finally {
//       setLoadingCourse(null);
//     }
//   };

//   return (
//     <div className='p-2'>
//       <header className="flex justify-between items-center p-4">
//         <h3 className='text-center text-4xl mb-4 ml-2'>Courses</h3>
//         <button
//           className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           onClick={() => navigate('addcourse')}
//         >
//           Add Course
//         </button>
//       </header>
//       <div style={{ width: "97%" }} className="p-4">
//         {loading ? (
//           <div className="text-center">Loading courses...</div>
//         ) : (
//           courses.map((course) => (
//             <div
//               key={course.Courseid}
//               className="p-2 mb-2 rounded bg-gray-200"
//             >
//               <div className="flex justify-between items-center p-2">
//                 <div className="flex flex-col">
//                   <p className='text-xl mr-4'>{course.coursename}</p>
//                   <p className='text-lg'>Course Code: {course.coursecode}</p>
//                 </div>
//                 <div className='flex justify-center gap-x-4 items-center'>
//                   <FaRegEdit
//                     className='cursor-pointer text-cyan-900 text-xl mr-2'
//                     onClick={() => handleEdit(course.coursecode)}
//                   />
//                   <MdOutlineDeleteOutline
//                     className='cursor-pointer text-cyan-900 text-xl mr-2'
//                     onClick={() => handleDelete(course.coursecode)}
//                     disabled={loadingCourse === course.coursecode}
//                   />
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Courses;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(null);
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('admintoken');
      const response = await axios.get('http://localhost:3001/admin/courses', {
        headers: {
          Authorization: `${token}`,
        },
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
      setPreview(true);
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleSubmit = async () => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const admintoken = Cookies.get('admintoken');
    try {
      const response = await axios.post('http://localhost:3001/admin/addcourses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${admintoken}`,
        },
      });
      toast.success(response.data.message);
      setPreview(false); // Hide the preview
      fetchCourses(); // Re-render the courses list
    } catch (error) {
      const errormessage = error.response.data.details;
      toast.error(errormessage);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (courseID) => {
    navigate(`editcourse/${courseID}`);
  };

  const handleDelete = async (coursecode) => {
    setLoadingCourse(coursecode);
    try {
      const token = Cookies.get('admintoken');
      await axios.delete(`http://localhost:3001/admin/course/${coursecode}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.info('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    } finally {
      setLoadingCourse(null);
    }
  };

  return (
    <div className="p-2">
      <header className="flex justify-between items-center p-4">
        <h3 className="text-center text-4xl mb-4 ml-2">Courses</h3>
        <div className="flex gap-4">
          <button
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate('addcourse')}
          >
            Add Course
          </button>
          <label
            style={{ background: '#1A2438' }}
            htmlFor="file_input"
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Upload Bulk Courses
          </label>
          <input
            id="file_input"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </header>

      <div style={{ width: '97%' }} className="p-4">
        {preview ? (
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div style={{ width: '70vw' }} className="overflow-x-auto downscroll">
              <table style={{ width: '70vw' }} className="bg-white border border-gray-200">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      {Object.values(row).map((value, i) => (
                        <td
                          key={i}
                          className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              
              style={{ background: '#1A2438' , width: '70vw' }}
              onClick={handleSubmit}
              className={`mt-4  py-2 px-4 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={uploading}
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        ) : loading ? (
          <div className="text-center">Loading courses...</div>
        ) : (
          courses.map((course) => (
            <div
              key={course.Courseid}
              className="p-2 mb-2 rounded bg-gray-200"
            >
              <div className="flex justify-between items-center p-2">
                <div className="flex flex-col">
                  <p className="text-xl mr-4">{course.coursename}</p>
                  <p className="text-lg">Course Code: {course.coursecode}</p>
                </div>
                <div className="flex justify-center gap-x-4 items-center">
                  <FaRegEdit
                    className="cursor-pointer text-cyan-900 text-xl mr-2"
                    onClick={() => handleEdit(course.coursecode)}
                  />
                  <MdOutlineDeleteOutline
                    className="cursor-pointer text-cyan-900 text-xl mr-2"
                    onClick={() => handleDelete(course.coursecode)}
                    disabled={loadingCourse === course.coursecode}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;

