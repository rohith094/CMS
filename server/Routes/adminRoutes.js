import express from "express";
import connection from '../db.js';
import adminAuth from "./adminAuth.js";
import bcrypt from 'bcrypt';
import multer from "multer";
import xlsx from 'xlsx';
import fs from 'fs';
import jwt from 'jsonwebtoken';
const upload = multer({ dest: 'uploads/' });

const Router = express.Router();

//adminlogin 

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

// Add a new semester
Router.post('/addsemester', adminAuth, async (req, res) => {
  const { semesternumber, semestername, startdate, enddate, batchyear, semesteractive } = req.body;
  const query = `
    INSERT INTO semesters (semesternumber, semestername, startdate, enddate, batchyear, semesteractive) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await connection.execute(query, [semesternumber, semestername, startdate, enddate, batchyear, semesteractive]);
    res.status(201).json({ message: 'Semester added successfully', semesterid: result.insertId });
  } catch (error) {
    console.error('An error occurred while adding the semester:', error);
    res.status(500).send('An error occurred');
  }
});

// Edit a semester by ID
Router.put('/editsemester/:semesterid', adminAuth, async (req, res) => {
  const { semesterid } = req.params;
  const { semesternumber, semestername, startdate, enddate, batchyear, semesteractive } = req.body;
  const query = `
    UPDATE semesters 
    SET semesternumber = ?, semestername = ?, startdate = ?, enddate = ?, batchyear = ?, semesteractive = ? 
    WHERE semesterid = ?`;
  const query2 = 'SELECT * FROM semesters WHERE semesterid = ?';

  try {
    const [existingSemester] = await connection.execute(query2, [semesterid]);
    if (existingSemester.length === 0) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    await connection.execute(query, [semesternumber, semestername, startdate, enddate, batchyear, semesteractive, semesterid]);
    res.json({ message: 'Semester updated successfully' });
  } catch (error) {
    console.error('An error occurred while updating the semester:', error);
    res.status(500).send('An error occurred');
  }
});

// View all semesters
Router.get('/viewsemesters', adminAuth, async (req, res) => {
  const query = 'SELECT * FROM semesters ORDER BY semesteractive DESC';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching semesters:', error);
    res.status(500).send('An error occurred');
  }
});

// View all semesters ordered by semester number
Router.get('/allsemesters', adminAuth, async (req, res) => {
  const query = 'SELECT * FROM semesters ORDER BY semesternumber';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching semesters:', error);
    res.status(500).send('An error occurred');
  }
});

// View a specific semester by ID
Router.get('/semester/:semesterid', adminAuth, async (req, res) => {
  const { semesterid } = req.params;
  const query = 'SELECT * FROM semesters WHERE semesterid = ?';

  try {
    const [result] = await connection.execute(query, [semesterid]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    res.json(result[0]); // Send the first result, which should be the single semester
  } catch (error) {
    console.error('An error occurred while retrieving the semester:', error);
    res.status(500).send('An error occurred');
  }
});

// Delete a semester by ID
Router.delete('/deletesemester/:semesterid', adminAuth, async (req, res) => {
  const { semesterid } = req.params;
  const query = 'DELETE FROM semesters WHERE semesterid = ?';
  const query2 = 'SELECT * FROM semesters WHERE semesterid = ?';

  try {
    const [existingSemester] = await connection.execute(query2, [semesterid]);
    if (existingSemester.length === 0) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    await connection.execute(query, [semesterid]);
    res.json({ message: 'Semester deleted successfully' });
  } catch (error) {
    console.error('An error occurred while deleting the semester:', error);
    res.status(500).send('An error occurred');
  }
});

// Manage semester status (activate/deactivate) by ID
Router.put('/managesemester/:semesterid', adminAuth, async (req, res) => {
  const { semesterid } = req.params;
  const { semesteractive } = req.body;
  const query = 'UPDATE semesters SET semesteractive = ? WHERE semesterid = ?';

  try {
    await connection.execute(query, [semesteractive, semesterid]);
    res.json({ message: 'Semester status updated successfully' });
  } catch (error) {
    console.error('An error occurred while updating semester status:', error);
    res.status(500).send('An error occurred');
  }
});

// Branch routes 

Router.post('/addbranch', adminAuth, async (req, res) => {
  const { branchcode, branchname, hodname, blocknumber, branchshortcut } = req.body;
  const query = `INSERT INTO branches (branchcode, branchname, hodname, blocknumber, branchshortcut)
                 VALUES (?, ?, ?, ?, ?)`;

  try {
    const [result] = await connection.execute(query, [branchcode, branchname, hodname, blocknumber, branchshortcut]);
    res.status(201).json({ branchid: result.insertId, branchcode, branchname, hodname, blocknumber, branchshortcut });
  } catch (error) {
    console.error('An error occurred while adding the branch:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/branches', adminAuth, async (req, res) => {
  const query = 'SELECT * FROM branches';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching branches:', error);
    res.status(500).send('An error occurred');
  }
});


Router.get('/branch/:id', adminAuth, async (req, res) => {
  const query = 'SELECT * FROM branches WHERE branchid = ?';

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
  const { branchname, hodname, blocknumber, branchshortcut } = req.body;
  const query = `UPDATE branches SET branchname = ?, hodname = ?, blocknumber = ?, branchshortcut = ? 
                 WHERE branchid = ?`;

  try {
    const [result] = await connection.execute(query, [branchname, hodname, blocknumber, branchshortcut, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Branch not found');
    }
    res.json({ branchid: req.params.id, branchname, hodname, blocknumber, branchshortcut });
  } catch (error) {
    console.error('An error occurred while updating the branch:', error);
    res.status(500).send('An error occurred');
  }
});

Router.delete('/branch/:id', adminAuth, async (req, res) => {
  const query = 'DELETE FROM branches WHERE branchid = ?';

  try {
    const [result] = await connection.execute(query, [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Branch not found');
    }
    res.status(200).send("Delete successful");
  } catch (error) {
    console.error('An error occurred while deleting the branch:', error);
    res.status(500).send('An error occurred');
  }
});


// admission routes 

const generateApplicationNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `UG-${currentYear}`;

  try {
    // Query to count existing applications for the current year
    const [results] = await connection.query(
      `SELECT COUNT(*) AS count FROM studentinfo WHERE applicationnumber LIKE ?`,
      [`${prefix}%`]
    );

    const count = results[0].count + 1;
    const applicationNumber = `${prefix}${count.toString().padStart(4, '0')}`;
    return applicationNumber;
  } catch (err) {
    console.error('Error generating application number:', err);
    throw err; // Re-throw the error to be handled by the calling function
  }
};

const generateRegistrationNumber = async (branchCode, joiningYear) => {
  try {
    // Fetch the branch name based on the branch code
    const [branchResults] = await connection.query(
      'SELECT branchshortcut FROM branches WHERE branchcode = ?',
      [branchCode]
    );

    if (branchResults.length === 0) {
      throw new Error(`Branch with code ${branchCode} not found`);
    }

    const branchName = branchResults[0].branchshortcut;

    // Query to count existing registrations for the specific branch and year
    const [countResults] = await connection.query(
      `SELECT COUNT(*) AS count FROM studentinfo WHERE registrationid LIKE ?`,
      [`${branchName}-${joiningYear}-%`]
    );

    const count = countResults[0].count + 1;
    const paddedCount = count.toString().padStart(3, '0');
    const registrationNumber = `${branchName}-${joiningYear}-${paddedCount}`;

    return registrationNumber;
  } catch (err) {
    console.error('Error generating registration number:', err);
    throw err; // Re-throw the error to be handled by the calling function
  }
};

const semestercheck = (entrancetype) =>{
  if(entrancetype === 'ecet'){
    return 3;
  }
  return 1;
}
// Route to admit a student
Router.post('/admitstudent', adminAuth, async (req, res) => {
  try {
    const applicationNumber = await generateApplicationNumber();
    const password = "gmritcms2024";
    const {
      joiningdate,
      nameasperssc,
      studentaadhar,
      mobile,
      alternatemobile,
      personalemail,
      gender,
      dob,
      branch,
      joiningyear,
      quota,
      admissiontype,
      fathername,
      mothername,
      fatheraadhar,
      motheraadhar,
      scholarshipholder,
      presentaddress,
      presentpincode,
      currentaddress,
      currentpincode,
      moa,
      remarks,
      entrancetype,
      entrancehallticket,
      rank,
      city,
      state,
      nationality,
      religion,
      caste,
      castecategory
    } = req.body;

    const semesternumber = semestercheck(entrancetype);
    const hashedpassword = await bcrypt.hash(password, 10);
    console.log("hashedpassword", hashedpassword);

    const registrationnumber = await generateRegistrationNumber(branch, joiningyear);
    const query = `
      INSERT INTO studentinfo (
        applicationnumber, admissionnumber, registrationid, joiningdate, nameasperssc,
        studentaadhar, mobile, alternatemobile, personalemail, gender, dob, branch, joiningyear, quota,
        admissiontype, fathername, mothername, fatheraadhar, motheraadhar, scholarshipholder, presentaddress,
        presentpincode, currentaddress, currentpincode, moa, remarks, entrancetype, entrancehallticket, rank,
        city, state, nationality, religion, caste, castecategory, studentstatus, studentpassword, semesternumber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const status = 0;
    const values = [
      applicationNumber, registrationnumber, registrationnumber, joiningdate, nameasperssc,
      studentaadhar, mobile, alternatemobile, personalemail, gender, dob, branch, joiningyear, quota,
      admissiontype, fathername, mothername, fatheraadhar, motheraadhar, scholarshipholder, presentaddress,
      presentpincode, currentaddress, currentpincode, moa, remarks, entrancetype, entrancehallticket, rank,
      city, state, nationality, religion, caste, castecategory,status,hashedpassword, semesternumber
    ];

    await connection.query(query, values);
    res.status(200).json({ message: 'Student added successfully', applicationnumber: applicationNumber });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add student', details: err.message });
  }
});

Router.post('/admitstudents', adminAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;

  try {
    // Read the file from the disk
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      const applicationNumber = await generateApplicationNumber();

      const query = `
        INSERT INTO studentinfo (
          applicationnumber, admissionnumber, registrationid, joiningdate, firstname, middlename, lastname,
          studentaadhar, mobile, alternatemobile, personalemail, gender, dob, branch, joiningyear, quota,
          admissiontype, fathername, mothername, fatheraadhar, motheraadhar, scholarshipholder, presentaddress,
          presentpincode, currentaddress, currentpincode, moa, remarks, entrancetype, entrancehallticket, rank,
          city, state, nationality, religion, caste, castecategory
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

      const values = [
        applicationNumber, row.admissionnumber, row.registrationid, row.joiningdate, row.firstname, row.middlename, row.lastname,
        row.studentaadhar, row.mobile, row.alternatemobile, row.personalemail, row.gender, row.dob, row.branch, row.joiningyear, row.quota,
        row.admissiontype, row.fathername, row.mothername, row.fatheraadhar, row.motheraadhar, row.scholarshipholder, row.presentaddress,
        row.presentpincode, row.currentaddress, row.currentpincode, row.moa, row.remarks, row.entrancetype, row.entrancehallticket, row.rank,
        row.city, row.state, row.nationality, row.religion, row.caste, row.castecategory
      ];

      await connection.query(query, values);
    }

    res.status(200).json({ message: 'Students added successfully' });
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).json({ error: 'Failed to add students', details: err.message });
  }
});


//Courses

Router.post('/addcourse', adminAuth, async (req, res) => {
  const { coursecode, coursename,alternativename,coursedescription, coursecredits, learninghours,totalcoursecredits, branchcode, coursetype } = req.body;
  const query = `INSERT INTO courses (coursecode, coursename,alternativename,coursedescription, coursecredits,learninghours,totalcoursecredits,  branchcode, coursetype)
                 VALUES (?, ?, ?, ?, ?, ?, ?,?,?)`;

  try {
    const [result] = await connection.execute(query, [coursecode, coursename,alternativename,coursedescription, coursecredits, learninghours,totalcoursecredits, branchcode, coursetype,]);
    res.status(201).json({
      courseid: result.insertId,
      coursecode,
      coursename,
      alternativename,
      coursedescription,
      coursecredits,
      learninghours,
      totalcoursecredits,
      branchcode,
      coursetype
    });
  } catch (error) {
    console.error('An error occurred while adding the course:', error);
    res.status(500).send(error.sqlMessage);
  }
});


Router.post('/addcourses', adminAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;

  try {
    // Read the file from the disk
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      // Check for missing fields
      // if (!row.coursecode || !row.coursename || !row.coursecredits || !row.semesternumber || !row.branchcode || !row.coursetype) {
      //   continue; // Skip rows with missing required fields
      // }

      // Insert course data into the database
      const [existingCourse] = await connection.query(
        'SELECT coursecode FROM courses WHERE coursecode = ?',
        [row.coursecode]
      );

      if (existingCourse.length > 0) {
        console.log(`Course with code ${row.coursecode} already exists. Skipping.`);
        continue; // Skip inserting this row if coursecode already exists
      }

      
      const query = `
        INSERT INTO courses (
          coursecode, coursename,alternativename,coursedescription, coursecredits,learninghours,totalcoursecredits, branchcode, coursetype
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        row.coursecode, row.coursename, row.alternativename, row.coursedescription, row.coursecredits, row.learninghours, row.totalcoursecredits, row.branchcode, row.coursetype
      ];

      await connection.query(query, values);
    }

    res.status(200).json({ message: 'Courses added successfully' });
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).json({ error: 'Failed to add courses', details: err.message });
  } finally {
    fs.unlinkSync(filePath); // Clean up the uploaded file
  }
});

// Get all courses
Router.get('/courses', adminAuth, async (req, res) => {
  const query = 'SELECT * FROM courses';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching courses:', error);
    res.status(500).send('An error occurred');
  }
});

// Get a specific course by coursecode
Router.get('/course/:coursecode', adminAuth, async (req, res) => {
  const query = 'SELECT * FROM courses WHERE coursecode = ?';

  try {
    const [results] = await connection.execute(query, [req.params.coursecode]);
    if (results.length === 0) {
      return res.status(404).send('Course not found');
    }
    res.json(results[0]);
  } catch (error) {
    console.error('An error occurred while fetching the course:', error);
    res.status(500).send('An error occurred');
  }
});

// Update a course by coursecode
Router.put('/course/:coursecode', adminAuth, async (req, res) => {
  const { coursename, coursecredits, semesternumber, branchcode, coursetype } = req.body;
  const query = `UPDATE courses SET coursename = ?, coursecredits = ?, semesternumber = ?, branchcode = ?, coursetype = ? 
                 WHERE coursecode = ?`;

  try {
    const [result] = await connection.execute(query, [coursename, coursecredits, semesternumber, branchcode, coursetype, req.params.coursecode]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Course not found');
    }
    res.json({
      coursecode: req.params.coursecode,
      coursename,
      coursecredits,
      semesternumber,
      branchcode,
      coursetype
    });
  } catch (error) {
    console.error('An error occurred while updating the course:', error);
    res.status(500).send('An error occurred');
  }
});

// Delete a course by coursecode
Router.delete('/course/:coursecode', adminAuth, async (req, res) => {
  const query = 'DELETE FROM courses WHERE coursecode = ?';

  try {
    const [result] = await connection.execute(query, [req.params.coursecode]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Course not found');
    }
    res.status(200).send('Course deleted successfully');
  } catch (error) {
    console.error('An error occurred while deleting the course:', error);
    res.status(500).send('An error occurred');
  }
});

export default Router;






