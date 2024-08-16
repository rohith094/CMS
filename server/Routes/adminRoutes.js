import express from "express";
import connection from '../db.js';
// import authRoute from "./authRoute.js";
import adminAuth from "./adminAuth.js";
import bcrypt from 'bcrypt';
import multer from "multer";
import xlsx from 'xlsx';
import fs from 'fs';
import jwt from 'jsonwebtoken';
const upload = multer({ dest: 'uploads/' });

const Router = express.Router();

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

Router.post("/login", async (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password) {
    return res.status(400).send("Email and password are required");
  }

  const query = "SELECT * FROM admins WHERE admin_mobile = ?";

  try {
    // Check if the student exists with the given email
    const [results] = await connection.execute(query, [mobile]);

    if (results.length === 0) {
      return res.status(404).send("admin does not exist");
    }

    const student = results[0];

    // Compare the provided password with the stored hashed password
    // const passwordMatch = await bcrypt.compare(password, student.spassword);
    if (student.admin_password != password) {
      return res.status(401).send("password doesnot match");
    }

    // Generate JWT token
    const token = jwt.sign({ mobile }, process.env.SECRET_KEY, { expiresIn: "3h" });
    console.log('token', token);
    return res.json({ token });
  } catch (error) {
    console.log("Error ", error);
    return res.status(500).send("An error occurred");
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

// Admin route to update the seen flag
Router.get('/feedbacks', adminAuth, async (req, res) => {
  const query = 'select * from feedbacks';

  try {
    const [results] = await connection.execute(query);
    if (results.length === 0) {
      res.status(404).send("user not found");
    }
    res.json(results);
  } catch (error) {
    res.status(500).send(error);
  }
})

Router.post('/feedback/mark-seen', adminAuth, async (req, res) => {
  const { jntuno } = req.body;

  if (!jntuno) {
    return res.status(400).send('jntuno and seen flag are required');
  }

  const query = 'UPDATE feedbacks SET seen = 1 WHERE jntuno = ?';

  try {
    const [updateResults] = await connection.execute(query, [jntuno]);

    if (updateResults.affectedRows === 0) {
      return res.status(404).send('Feedback not found or already marked as seen');
    }

    res.json({ success: true, message: `Seen flag updated to 1 for student with JNTU number ${jntuno}` });
  } catch (error) {
    console.error('An error occurred while updating the seen flag:', error);
    res.status(500).send('An error occurred');
  }
});

// Semester routes 


Router.post('/addsemester', adminAuth, async (req, res) => {
  const { SemesterNumber, StartDate, EndDate, SemesterActive } = req.body;
  const query = 'INSERT INTO Semesters (SemesterNumber, StartDate, EndDate, SemesterActive) VALUES (?, ?, ?, ?)';

  try {
    const [result] = await connection.execute(query, [SemesterNumber, StartDate, EndDate, SemesterActive]);
    res.status(201).json({ message: 'Semester added successfully', SemesterID: result.insertId });
  } catch (error) {
    console.error('An error occurred while adding the semester:', error);
    res.status(500).send('An error occurred');
  }
});

Router.put('/editsemester/:SemesterID', adminAuth, async (req, res) => {
  const { SemesterID } = req.params;
  const { SemesterNumber, StartDate, EndDate, SemesterActive } = req.body;
  const query = 'UPDATE Semesters SET SemesterNumber = ?, StartDate = ?, EndDate = ?, SemesterActive = ? WHERE SemesterID = ?';
  const query2 = 'SELECT * FROM Semesters WHERE SemesterID = ?'
  try {

    const [existingSemester] = await connection.execute(query2, [SemesterID]);
    if (existingSemester.length === 0) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    await connection.execute(query, [SemesterNumber, StartDate, EndDate, SemesterActive, SemesterID]);
    res.json({ message: 'Semester updated successfully' });
  } catch (error) {
    console.error('An error occurred while updating the semester:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/viewsemesters', adminAuth, async (req, res) => {
  const query = 'SELECT * FROM Semesters order by SemesterActive desc';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching semesters:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/allsemesters', adminAuth, async (req, res) => {
  const query = 'SELECT * FROM Semesters order by SemesterNumber';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching semesters:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/semester/:SemesterID', adminAuth, async (req, res) => {
  const { SemesterID } = req.params;
  const query = 'SELECT * FROM Semesters WHERE SemesterID = ?';

  try {
    const [result] = await connection.execute(query, [SemesterID]);
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    res.json(result[0]); // Send the first result, which should be the single semester
  } catch (error) {
    console.error('An error occurred while retrieving the semester:', error);
    res.status(500).send('An error occurred');
  }
});


Router.delete('/deletesemester/:SemesterID', adminAuth, async (req, res) => {
  const { SemesterID } = req.params;
  const query = 'DELETE FROM Semesters WHERE SemesterID = ?';
  const query2 = 'SELECT * FROM Semesters WHERE SemesterID = ?'

  try {
    const [existingSemester] = await connection.execute(query2, [SemesterID]);
    console.log(existingSemester);
    if (existingSemester.length === 0) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    await connection.execute(query, [SemesterID]);
    res.json({ message: 'Semester deleted successfully' });
  } catch (error) {
    console.error('An error occurred while deleting the semester:', error);
    res.status(500).send('An error occurred');
  }
});

Router.put('/managesemester/:SemesterID', adminAuth, async (req, res) => {
  const { SemesterID } = req.params;
  const { SemesterActive } = req.body;
  const query = 'UPDATE Semesters SET SemesterActive = ? WHERE SemesterID = ?';

  try {
    await connection.execute(query, [SemesterActive, SemesterID]);
    res.json({ message: 'Semester status updated successfully' });
  } catch (error) {
    console.error('An error occurred while updating semester status:', error);
    res.status(500).send('An error occurred');
  }
});


// Branch routes 


Router.post('/addbranch', adminAuth, async (req, res) => {
  const { BranchName, HodName, BlockNumber } = req.body;
  const query = 'INSERT INTO Branches (BranchName, HodName, BlockNumber) VALUES (?, ?, ?)';

  try {
    const [result] = await connection.execute(query, [BranchName, HodName, BlockNumber]);
    res.status(201).json({ BranchID: result.insertId, BranchName, HodName, BlockNumber });
  } catch (error) {
    console.error('An error occurred while adding the branch:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/branches', adminAuth, async (req, res) => {
  const query = 'SELECT * FROM Branches';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching branches:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/branch/:id', adminAuth, async (req, res) => {
  const query = 'SELECT * FROM Branches WHERE BranchID = ?';

  try {
    const [results] = await connection.execute(query, [req.params.id]);
    if (results.length === 0) {
      return res.status(404).send('Branch not found');
    }
    res.json(results[0]);
  } catch (error) {
    console.error('An error occurred while fetching the branch:', error);
    res.status(500).send('An error occurred');
  }
});

Router.put('/branch/:id', adminAuth, async (req, res) => {

  const {branchId} = req.params;

  const { BranchName, HodName, BlockNumber } = req.body;
  const query = 'UPDATE Branches SET BranchName = ?, HodName = ?, BlockNumber = ? WHERE BranchID = ?';

  try {
    const [result] = await connection.execute(query, [BranchName, HodName, BlockNumber, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Branch not found');
    }
    res.json({ BranchID: req.params.id, BranchName, HodName, BlockNumber });
  } catch (error) {
    console.error('An error occurred while updating the branch:', error);
    res.status(500).send('An error occurred');
  }
});

Router.delete('/branch/:id', adminAuth, async (req, res) => {

  const query = 'DELETE FROM Branches WHERE BranchID = ?';

  try {
    const [result] = await connection.execute(query, [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Branch not found');
    }
    res.status(200).send("delete successfull");
  } catch (error) {
    console.error('An error occurred while deleting the branch:', error);
    res.status(500).send('An error occurred');
  }
});

// Sections 

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




export default Router;






