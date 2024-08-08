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

Router.post('/addstudent',adminAuth, async (req, res) => {
  const { jntuno, email, fname,lname, branch, jyear, cyear, imageurl  } = req.body;
  const password ='studentpassowrd'
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

    const hashedpassword = await  bcrypt.hash(password, 10);
    console.log("hashedpassword", hashedpassword);


    const [results] = await connection.execute(query, [jntuno, email, hashedpassword, fname,lname, branch, jyear, cyear, imageurl]);

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

Router.delete('/deletestudent',adminAuth, async (req, res) => {
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

Router.post('/addstudents',adminAuth, upload.single('file'), async (req, res) => {
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
  const {jntuno} = req.params;
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


export default Router;






