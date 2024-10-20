//sections

Router.post('/addsection', adminAuth, async (req, res) => {
  const { SectionName, BranchID, SemesterID } = req.body;

  // Query to check if the section already exists
  const checkQuery = 'SELECT * FROM Sections WHERE SectionName = ? AND BranchID = ? AND SemesterID = ?';
  
  // Query to insert the new section
  const insertQuery = 'INSERT INTO Sections (SectionName, BranchID, SemesterID) VALUES (?, ?, ?)';

  try {
    // Check if the section already exists
    const [existingSections] = await connection.execute(checkQuery, [SectionName, BranchID, SemesterID]);

    if (existingSections.length > 0) {
      // If section exists, return a conflict status
      return res.status(409).json({ message: 'Section already exists' });
    }

    // If section doesn't exist, insert the new section
    const [result] = await connection.execute(insertQuery, [SectionName, BranchID, SemesterID]);
    res.status(201).json({ SectionID: result.insertId, SectionName, BranchID, SemesterID });
    
  } catch (error) {
    console.error('An error occurred while adding the section:', error);
    res.status(500).send('An error occurred');
  }
});


Router.get('/allsections', adminAuth, async (req, res) => {
  const query = 'SELECT * FROM Sections';

  try {
    const [sections] = await connection.execute(query);
    res.status(200).json(sections);
  } catch (error) {
    console.error('An error occurred while retrieving the sections:', error);
    res.status(500).send('An error occurred');
  }
});

// Example of updated API endpoint for fetching sections with branch and semester details
Router.get('/sections', adminAuth, async (req, res) => {
  const query = `
    SELECT s.*, b.BranchName, sm.SemesterNumber
    FROM Sections s
    LEFT JOIN Branches b ON s.BranchID = b.BranchID
    LEFT JOIN Semesters sm ON s.SemesterID = sm.SemesterID
  `;

  try {
    const [result] = await connection.execute(query);
    res.json(result);
  } catch (error) {
    console.error('An error occurred while retrieving sections:', error);
    res.status(500).send('An error occurred');
  }
});


Router.get('/section/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Sections WHERE SectionID = ?';

  try {
    const [sections] = await connection.execute(query, [id]);
    if (sections.length > 0) {
      res.status(200).json(sections[0]);
    } else {
      res.status(404).send('Section not found');
    }
  } catch (error) {
    console.error('An error occurred while retrieving the section:', error);
    res.status(500).send('An error occurred');
  }
});


Router.put('/updatesection/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { SectionName, BranchID, SemesterID } = req.body;

  // Query to check if the section with the same SectionName, BranchID, and SemesterID exists (excluding the current section)
  const checkQuery = 'SELECT * FROM Sections WHERE SectionName = ? AND BranchID = ? AND SemesterID = ? AND SectionID != ?';

  // Query to update the section
  const updateQuery = 'UPDATE Sections SET SectionName = ?, BranchID = ?, SemesterID = ? WHERE SectionID = ?';

  try {
    // Check if there is a conflicting section
    const [existingSections] = await connection.execute(checkQuery, [SectionName, BranchID, SemesterID, id]);

    if (existingSections.length > 0) {
      // If a conflicting section exists, return a conflict status
      return res.status(409).json({ message: 'A section with the same name, branch, and semester already exists.' });
    }

    // If no conflict, proceed with the update
    const [result] = await connection.execute(updateQuery, [SectionName, BranchID, SemesterID, id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ SectionID: id, SectionName, BranchID, SemesterID });
    } else {
      res.status(404).send('Section not found');
    }
  } catch (error) {
    console.error('An error occurred while updating the section:', error);
    res.status(500).send('An error occurred');
  }
});


Router.delete('/deletesection/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Sections WHERE SectionID = ?';

  try {
    const [result] = await connection.execute(query, [id]);
    if (result.affectedRows > 0) {
      res.status(200).send('Section deleted successfully');
    } else {
      res.status(404).send('Section not found');
    }
  } catch (error) {
    console.error('An error occurred while deleting the section:', error);
    res.status(500).send('An error occurred');
  }
});





// All Faculty Routes 


Router.post('/addfaculty', adminAuth, async (req, res) => {
  const { email, fname, lname, phone_number, department, designation, date_of_birth, date_of_joining, address, city, state, zip_code, country, qualification, experience_years, experience_months, gender, profile_picture, workingstatus } = req.body;
  const password = 'facultyPassword';
  if (!fname || !email || !lname || !phone_number || !department || !designation || !date_of_birth || !date_of_joining || !address || !city || !state || !zip_code || !country || !qualification || !experience_years || !experience_months || !gender || !profile_picture || !workingstatus) {
    return res.status(400).send('Missing required fields');
  }

  const checkQuery = 'SELECT * FROM faculty WHERE email = ? OR phone_number = ?';
  const query = 'INSERT INTO faculty (email, fpassword, first_name, last_name, phone_number, department, designation, date_of_birth, date_of_joining, address, city, state, zip_code, country, qualification, experience_years, experience_months, gender, profile_picture, workingstatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
  try {
    const [existingFaculty] = await connection.execute(checkQuery, [email, phone_number]);

    if (existingFaculty.length > 0) {
      return res.status(409).send('A faculty member with the same email or phone number already exists');
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    console.log("hashedpassword", hashedpassword);

    const [results] = await connection.execute(query, [email, hashedpassword, fname, lname, phone_number, department, designation, date_of_birth, date_of_joining, address, city, state, zip_code, country, qualification, experience_years, experience_months, gender, profile_picture, workingstatus]);

    res.status(201).send('Faculty member added successfully');
  } catch (error) {
    console.error('An error occurred while adding a faculty member:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/allfaculty', adminAuth, async (req, res) => {
  const query = 'SELECT faculty_id, email, first_name, last_name, profile_picture FROM faculty';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching faculty members:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/allfaculty/departmentwise', adminAuth, async (req, res) => {
  const query = 'SELECT department, COUNT(*) as count FROM faculty GROUP BY department';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching department-wise faculty counts:', error);
    res.status(500).send('An error occurred');
  }
});

Router.put('/updatefaculty', adminAuth, async (req, res) => {
  const { faculty_id, email, fname, lname, phone_number, department, designation, date_of_birth, date_of_joining, address, city, state, zip_code, country, qualification, experience_years, experience_months, gender, profile_picture, workingstatus } = req.body;
  if (!faculty_id || !email || !fname || !lname || !phone_number || !department || !designation || !date_of_birth || !date_of_joining || !address || !city || !state || !zip_code || !country || !qualification || !experience_years || !experience_months || !gender || !profile_picture || !workingstatus) {
    return res.status(400).send('Missing required fields');
  }

  const checkQuery = 'SELECT * FROM faculty WHERE faculty_id = ?';
  const updateQuery = 'UPDATE faculty SET email = ?, first_name = ?, last_name = ?, phone_number = ?, department = ?, designation = ?, date_of_birth = ?, date_of_joining = ?, address = ?, city = ?, state = ?, zip_code = ?, country = ?, qualification = ?, experience_years = ?, experience_months = ?, gender = ?, profile_picture = ?, workingstatus = ? WHERE faculty_id = ?';

  try {
    const [existingFaculty] = await connection.execute(checkQuery, [faculty_id]);

    if (existingFaculty.length === 0) {
      return res.status(404).send('Faculty member not found');
    }

    await connection.execute(updateQuery, [email, fname, lname, phone_number, department, designation, date_of_birth, date_of_joining, address, city, state, zip_code, country, qualification, experience_years, experience_months, gender, profile_picture, workingstatus, faculty_id]);
    res.status(200).send('Faculty member updated successfully');
  } catch (error) {
    console.error('An error occurred while updating the faculty member:', error);
    res.status(500).send('An error occurred');
  }
});

Router.delete('/deletefaculty', adminAuth, async (req, res) => {
  const { faculty_id } = req.body;
  if (!faculty_id) {
    return res.status(400).send('Faculty ID is required');
  }

  const deleteQuery = 'DELETE FROM faculty WHERE faculty_id = ?';

  try {
    const [result] = await connection.execute(deleteQuery, [faculty_id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Faculty member not found');
    }
    res.status(200).send('Faculty member deleted successfully');
  } catch (error) {
    console.error('An error occurred while deleting the faculty member:', error);
    res.status(500).send('An error occurred');
  }
});

Router.post('/addfaculties', adminAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const checkQuery = 'SELECT * FROM faculty WHERE email = ? OR phone_number = ?';
  const query = 'INSERT INTO faculty (email, fpassword, first_name, last_name, phone_number, department, designation, date_of_birth, date_of_joining, address, city, state, zip_code, country, qualification, experience_years, experience_months, gender, profile_picture, workingstatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet_name_list = workbook.SheetNames;
    const faculties = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    for (const faculty of faculties) {
      const { email, password, fname, lname, phone_number, department, designation, date_of_birth, date_of_joining, address, city, state, zip_code, country, qualification, experience_years, experience_months, gender, profile_picture, workingstatus } = faculty;
      if (!fname || !email || !lname || !phone_number || !department || !designation || !date_of_birth || !date_of_joining || !address || !city || !state || !zip_code || !country || !qualification || !experience_years || !experience_months || !gender || !profile_picture || !workingstatus) {
        continue; // Skip faculties with missing fields
      }

      const [existingFaculty] = await connection.execute(checkQuery, [email, phone_number]);
      if (existingFaculty.length > 0) {
        continue; // Skip existing faculties
      }

      const hashedpassword = await bcrypt.hash(password, 10);
      await connection.execute(query, [email, hashedpassword, fname, lname, phone_number, department, designation, date_of_birth, date_of_joining, address, city, state, zip_code, country, qualification, experience_years, experience_months, gender, profile_picture, workingstatus]);
    }

    res.status(201).send('Faculties added successfully');
  } catch (error) {
    console.error('An error occurred while adding faculties:', error);
    res.status(500).send('An error occurred');
  } finally {
    fs.unlinkSync(req.file.path); // Clean up the uploaded file
  }
});

Router.get('/singlefaculty/:faculty_id', adminAuth, async (req, res) => {
  const { faculty_id } = req.params;
  const query = 'SELECT * FROM faculty WHERE faculty_id = ?';

  try {
    const [results] = await connection.execute(query, [faculty_id]);
    if (results.length === 0) {
      return res.status(404).send('Faculty member not found');
    }
    res.json(results[0]);
  } catch (error) {
    console.error('An error occurred while fetching faculty details:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/filterfaculty', adminAuth, async (req, res) => {
  const { department, designation } = req.query;
  let query = 'SELECT faculty_id, email, first_name, last_name, profile_picture FROM faculty WHERE 1=1';
  const params = [];

  if (department) {
    query += ' AND department = ?';
    params.push(department);
  }

  if (designation) {
    query += ' AND designation = ?';
    params.push(designation);
  }

  try {
    const [results] = await connection.execute(query, params);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching faculty members:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/filterfaculty/download', adminAuth, async (req, res) => {
  const { department, designation } = req.query;
  let query = 'SELECT * FROM faculty WHERE 1=1';
  const params = [];

  if (department) {
    query += ' AND department = ?';
    params.push(department);
  }

  if (designation) {
    query += ' AND designation = ?';
    params.push(designation);
  }

  try {
    const [results] = await connection.execute(query, params);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching faculty members:', error);
    res.status(500).send('An error occurred');
  }
});

//admin side student routes 

Router.post('/addstudent', adminAuth, async (req, res) => {
  const { jntuno, email, fname, lname, branch, jyear, cyear, imageurl } = req.body;
  const password = 'studentpassowrd'
  if (!fname || !jntuno || !password || !email || !lname || !branch || !jyear || !cyear || !imageurl) {
    return res.status(400).send('Missing required fields');
  }


  const checkQuery = 'SELECT * FROM students WHERE email = ? OR jntuno = ? ';
  const query = 'INSERT INTO students (jntuno, email, spassword, firstname, lastname, branch, joiningyear, currentyear, imageurl ) VALUES (?,?,?,?,?,?,?,?,?)';
  try {

    const [existingStudent] = await connection.execute(checkQuery, [email, jntuno]);


    if (existingStudent.length > 0) {
      return res.status(409).send('A student with the same email or JNTU number already exists');
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    console.log("hashedpassword", hashedpassword);


    const [results] = await connection.execute(query, [jntuno, email, hashedpassword, fname, lname, branch, jyear, cyear, imageurl]);

    res.status(201).send('User added successfully');
  } catch (error) {
    console.error('An error occurred while adding a user:', error);
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/allstudents', adminAuth, async (req, res) => {
  const query = 'SELECT jntuno,email,firstname,lastname,imageurl FROM students';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching users:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/allstudents/branchwise', adminAuth, async (req, res) => {
  const query = 'SELECT branch, COUNT(*) as count FROM students GROUP BY branch';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching branch-wise student counts:', error);
    res.status(500).send('An error occurred');
  }
});

Router.put('/updatestudent', adminAuth, async (req, res) => {
  const { jntuno, email, fname, lname, branch, jyear, cyear, imageurl } = req.body;
  if (!jntuno || !email || !fname || !lname || !branch || !jyear || !cyear || !imageurl) {
    return res.status(400).send('Missing required fields');
  }

  const checkQuery = 'SELECT * FROM students WHERE jntuno = ?';
  const updateQuery = 'UPDATE students SET email = ?, firstname = ?, lastname = ?, branch = ?, joiningyear = ?, currentyear = ?, imageurl = ? WHERE jntuno = ?';

  try {
    const [existingStudent] = await connection.execute(checkQuery, [jntuno]);

    if (existingStudent.length === 0) {
      return res.status(404).send('Student not found');
    }

    await connection.execute(updateQuery, [email, fname, lname, branch, jyear, cyear, imageurl, jntuno]);
    res.status(200).send('Student updated successfully');
  } catch (error) {
    console.error('An error occurred while updating the student:', error);
    res.status(500).send('An error occurred');
  }
});

Router.delete('/deletestudent', adminAuth, async (req, res) => {
  const { jntuno } = req.body;
  if (!jntuno) {
    return res.status(400).send('JNTU number is required');
  }

  const deleteQuery = 'DELETE FROM students WHERE jntuno = ?';

  try {
    const [result] = await connection.execute(deleteQuery, [jntuno]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Student not found');
    }
    res.status(200).send('Student deleted successfully');
  } catch (error) {
    console.error('An error occurred while deleting the student:', error);
    res.status(500).send('An error occurred');
  }
});

Router.post('/addstudents', adminAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const checkQuery = 'SELECT * FROM students WHERE email = ? OR jntuno = ? ';
  const query = 'INSERT INTO students (jntuno, email, spassword, firstname, lastname, branch, joiningyear, currentyear, imageurl ) VALUES (?,?,?,?,?,?,?,?,?)';



  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet_name_list = workbook.SheetNames;
    const students = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    for (const student of students) {
      const { jntuno, email, password, fname, lname, branch, jyear, cyear, imageurl } = student;
      if (!fname || !jntuno || !password || !email || !lname || !branch || !jyear || !cyear || !imageurl) {
        continue; // Skip students with missing fields
      }

      const [existingStudent] = await connection.execute(checkQuery, [email, jntuno]);
      if (existingStudent.length > 0) {
        continue; // Skip existing students
      }

      const hashedpassword = await bcrypt.hash(password, 10);
      await connection.execute(query, [jntuno, email, hashedpassword, fname, lname, branch, jyear, cyear, imageurl]);
    }

    res.status(201).send('Students added successfully');
  } catch (error) {
    console.error('An error occurred while adding students:', error);
    res.status(500).send('An error occurred');
  } finally {
    fs.unlinkSync(req.file.path); // Clean up the uploaded file
  }
});

Router.get('/singlestudent/:jntuno', adminAuth, async (req, res) => {
  const { jntuno } = req.params;
  const query = 'SELECT * FROM students WHERE jntuno = ?';

  try {
    const [results] = await connection.execute(query, [jntuno]);
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(results[0]);
  } catch (error) {
    console.error('An error occurred while fetching user details:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/filterstudents', adminAuth, async (req, res) => {
  const { currentyear, branch } = req.query;
  let query = 'SELECT jntuno, email, firstname, lastname, imageurl FROM students WHERE 1=1';
  const params = [];

  if (currentyear) {
    query += ' AND currentyear = ?';
    params.push(currentyear);
  }

  if (branch) {
    query += ' AND branch = ?';
    params.push(branch);
  }

  try {
    const [results] = await connection.execute(query, params);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching users:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/filterstudents/download', adminAuth, async (req, res) => {
  const { currentyear, branch } = req.query;
  let query = 'SELECT * FROM students WHERE 1=1';
  const params = [];

  if (currentyear) {
    query += ' AND currentyear = ?';
    params.push(currentyear);
  }

  if (branch) {
    query += ' AND branch = ?';
    params.push(branch);
  }

  try {
    const [results] = await connection.execute(query, params);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching users:', error);
    res.status(500).send('An error occurred');
  }
});



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const MapStudents = () => {
//   const { sectioncode } = useParams(); // Getting the sectioncode from URL parameters
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [buttonLoading, setButtonLoading] = useState(false);
//   const token = Cookies.get('admintoken')

//   useEffect(() => {
//     const fetchStudents = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`http://localhost:3001/admin/sectionstudentsbysemester/${sectioncode}`, {
//           headers : {
//             Authorization : `${token}`
//           }
//         });
//         setStudents(response.data);
//       } catch (error) {
//         console.error('Error fetching students:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, [sectioncode]);

//   const handleButtonClick = (registrationId) => {
//     setButtonLoading(true);
//     // Perform any action you want here
//     setTimeout(() => {
//       setButtonLoading(false); // Reset button loading state after action
//     }, 1000);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Map Students</h1>
//       {loading ? (
//         <div className="flex justify-center items-center">
//           <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-200">
//             <thead>
//               <tr>
//                 <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration ID</th>
//                 <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester Number</th>
//                 <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
//                 <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((student) => (
//                 <tr key={student.registrationid}>
//                   <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">{student.registrationid}</td>
//                   <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">{student.nameasperssc}</td>
//                   <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">{student.semesternumber}</td>
//                   <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">{student.branch}</td>
//                   <td className="px-6 py-4 whitespace-nowrap border-b">
//                     <button
//                       onClick={() => handleButtonClick(student.registrationid)}
//                       className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 ${
//                         buttonLoading ? 'opacity-50 cursor-not-allowed' : ''
//                       }`}
//                       disabled={buttonLoading}
//                     >
//                       {buttonLoading ? (
//                         <svg
//                           className="animate-spin h-5 w-5 text-white"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8v8l3.09-3.09a6 6 0 11-6.16 0L8 12z"
//                           ></path>
//                         </svg>
//                       ) : (
//                         'Map'
//                       )}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MapStudents;