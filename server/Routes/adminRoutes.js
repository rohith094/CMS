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
  const { jntuno, email, password, fname,lname, branch, jyear, cyear, imageurl  } = req.body;
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
  const query = 'SELECT * FROM students';
  
  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching users:', error);
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


export default Router;






