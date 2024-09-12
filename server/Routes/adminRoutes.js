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

Router.get('/branchname/:branchcode', adminAuth, async (req, res) => {
  const query = 'SELECT * FROM branches WHERE branchcode = ?';

  try {
    const [results] = await connection.execute(query, [req.params.branchcode]);
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

const generateRegistrationNumber = async (branchCode, joiningYear, entrancetype) => {
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
    let registrationNumber = `${branchName}-${joiningYear}-${paddedCount}`;
    if (entrancetype === 'ecet') {
      registrationNumber = `L${registrationNumber}`;
    }
  
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
      permanentaddress,
      permanentpincode,
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

    const registrationnumber = await generateRegistrationNumber(branch, joiningyear, entrancetype);
    const query = `
      INSERT INTO studentinfo (
        applicationnumber, admissionnumber, registrationid, joiningdate, nameasperssc,
        studentaadhar, mobile, alternatemobile, personalemail, gender, dob, branch, joiningyear, quota,
        admissiontype, fathername, mothername, fatheraadhar, motheraadhar, scholarshipholder, permanentaddress,
        permanentpincode, currentaddress, currentpincode, moa, remarks, entrancetype, entrancehallticket, rank,
        city, state, nationality, religion, caste, castecategory, studentstatus, studentpassword, semesternumber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const status = 0;
    const values = [
      applicationNumber, registrationnumber, registrationnumber, joiningdate, nameasperssc,
      studentaadhar, mobile, alternatemobile, personalemail, gender, dob, branch, joiningyear, quota,
      admissiontype, fathername, mothername, fatheraadhar, motheraadhar, scholarshipholder, permanentaddress,
      permanentpincode, currentaddress, currentpincode, moa, remarks, entrancetype, entrancehallticket, rank,
      city, state, nationality, religion, caste, castecategory,status,hashedpassword, semesternumber
    ];

    await connection.query(query, values);
    res.status(200).json({ message: 'Student added successfully', applicationnumber: applicationNumber });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add student', details: err.message });
  }
});

Router.get('/student/:registrationid', adminAuth, async (req, res) => {
  const { registrationid } = req.params;

  const query = `
    SELECT *
    FROM studentinfo 
    WHERE registrationid = ?`;

  try {
    const [student] = await connection.execute(query, [registrationid]);

    if (student.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student[0]);
  } catch (error) {
    console.error('An error occurred while fetching the student:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

Router.put('/student/:registrationid', adminAuth, async (req, res) => {
  const { registrationid } = req.params;
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
    permanentaddress,
    permanentpincode,
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
    castecategory,
    studentstatus
  } = req.body;

  const semesternumber = semestercheck(entrancetype);
  
  const query = `
    UPDATE studentinfo
    SET 
      joiningdate = ?,
      nameasperssc = ?,
      studentaadhar = ?,
      mobile = ?,
      alternatemobile = ?,
      personalemail = ?,
      gender = ?,
      dob = ?,
      branch = ?,
      joiningyear = ?,
      quota = ?,
      admissiontype = ?,
      fathername = ?,
      mothername = ?,
      fatheraadhar = ?,
      motheraadhar = ?,
      scholarshipholder = ?,
      permanentaddress = ?,
      permanentpincode = ?,
      currentaddress = ?,
      currentpincode = ?,
      moa = ?,
      remarks = ?,
      entrancetype = ?,
      entrancehallticket = ?,
      rank = ?,
      city = ?,
      state = ?,
      nationality = ?,
      religion = ?,
      caste = ?,
      castecategory = ?,
      studentstatus = ?,
      semesternumber = ?
    WHERE registrationid = ?`;

  const values = [
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
    permanentaddress,
    permanentpincode,
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
    castecategory,
    studentstatus,
    semesternumber,
    registrationid // This should be the last parameter
  ];

  try {
    const [result] = await connection.execute(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('An error occurred while updating the student:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});

//studentbulk update 
Router.put('/students/bulkupdate',adminAuth, upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Read the file using xlsx.readFile
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      const registrationid = row.registrationid; // Assuming the first column is always the primary key
      delete row.registrationid; // Remove primary key from the fields to update

      if (!registrationid) {
        continue; // Skip if registrationid is missing
      }

      const fieldsToUpdate = Object.keys(row);
      const valuesToUpdate = Object.values(row);

      // Dynamically construct the query
      const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');

      const query = `
        UPDATE studentinfo
        SET ${setClause}
        WHERE registrationid = ?`;

      const values = [...valuesToUpdate, registrationid];

      // Execute the query
      const [result] = await connection.execute(query, values);

      if (result.affectedRows === 0) {
        console.warn(`No student found with registrationid ${registrationid}`); 
      }
    }

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Bulk update successful' });
  } catch (error) {
    console.error('An error occurred during the bulk update:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
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

      const query = `
        INSERT INTO studentinfo (
          applicationnumber, admissionnumber, registrationid, joiningdate, firstname, middlename, lastname,
          studentaadhar, mobile, alternatemobile, personalemail, gender, dob, branch, joiningyear, quota,
          admissiontype, fathername, mothername, fatheraadhar, motheraadhar, scholarshipholder, presentaddress,
          presentpincode, currentaddress, currentpincode, moa, remarks, entrancetype, entrancehallticket, rank,
          city, state, nationality, religion, caste, castecategory
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

      const values = [
        row.applicationnumber, row.admissionnumber, row.registrationid, row.joiningdate, row.firstname, row.middlename, row.lastname,
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

Router.get('/admissionstudents/:joiningyear/:branchcode?', adminAuth, async (req, res) => {
  const { joiningyear, branchcode } = req.params;
  const studentstatus = req.query.studentstatus || '1'; // Default to active students

  let query = `
    SELECT 
      applicationnumber, 
      registrationid, 
      nameasperssc, 
      imgurl, 
      gender,
      studentstatus
    FROM studentinfo 
    WHERE joiningyear = ? AND studentstatus = ?`;

  let queryParams = [joiningyear, studentstatus];

  if (branchcode) {
    query += ' AND branch = ?';
    queryParams.push(branchcode);
  }

  const maleCountQuery = `
    SELECT COUNT(*) as maleCount 
    FROM studentinfo 
    WHERE joiningyear = ? AND gender = 'male' AND studentstatus = ? ${branchcode ? 'AND branch = ?' : ''}`;

  const femaleCountQuery = `
    SELECT COUNT(*) as femaleCount 
    FROM studentinfo 
    WHERE joiningyear = ? AND gender = 'female' AND studentstatus = ? ${branchcode ? 'AND branch = ?' : ''}`;

  try {
    const [students] = await connection.execute(query, queryParams);
    const [[{ maleCount }]] = await connection.execute(maleCountQuery, queryParams);
    const [[{ femaleCount }]] = await connection.execute(femaleCountQuery, queryParams);

    res.json({ students, maleCount, femaleCount });
  } catch (error) {
    console.error('An error occurred while fetching students:', error);
    res.status(500).send('An error occurred');
  }
});

//manage student active and inactive 
Router.put('/studentstatus/:registrationid', async (req, res) => {
  const { registrationid } = req.params;
  const { studentstatus } = req.body;

  try {
      const result = await connection.query(
          'UPDATE studentinfo SET studentstatus = ? WHERE registrationid = ?',
          [studentstatus, registrationid]
      );
      
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Student not found' });
      }

      res.json({ message: 'Student status updated successfully' });
  } catch (error) {
      console.error('Error updating student status:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

Router.post('/downloadstudents/:year/:branch?', adminAuth, async (req, res) => {
  const { year, branch } = req.params;
  const { fields, studentstatus } = req.body;

  try {
    let query = `
      SELECT ${fields.join(', ')}
      FROM studentinfo
      WHERE joiningyear = ? AND studentstatus = ?
    `;
    
    const queryParams = [year, studentstatus];
    
    if (branch) {
      query += ` AND branch = ?`;
      queryParams.push(branch);
    }

    const [students] = await connection.query(query, queryParams);

    // Convert the data to Excel format
    const worksheet = xlsx.utils.json_to_sheet(students);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Convert the workbook to a buffer
    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Disposition', `attachment; filename=Filtered_Students_${year}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

  } catch (error) {
    console.error('Error fetching students for download:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

Router.get('/student-analytics',adminAuth, async (req, res) => {
  try {
    const query = `
      SELECT 
        joiningyear,
        gender,
        COUNT(*) as count
      FROM 
        studentinfo
      WHERE 
        joiningyear >= YEAR(CURDATE()) - 4
      GROUP BY 
        joiningyear, gender
      ORDER BY 
        joiningyear ASC;
    `;

    const [rows] = await connection.query(query);

    // Process data to fit the format needed for the graphs
    const barGraphData = {};
    const lineGraphData = {};

    rows.forEach(row => {
      const { joiningyear, gender, count } = row;
      if (!barGraphData[joiningyear]) {
        barGraphData[joiningyear] = { male: 0, female: 0 };
      }
      barGraphData[joiningyear][gender.toLowerCase()] = count;

      if (!lineGraphData[joiningyear]) {
        lineGraphData[joiningyear] = 0;
      }
      lineGraphData[joiningyear] += count;
    });

    res.json({ barGraphData, lineGraphData });
  } catch (error) {
    console.error('Error fetching student analytics:', error);
    res.status(500).json({ error: 'Failed to fetch student analytics' });
  }
});


//student routes

Router.post('/addstudent', adminAuth, async (req, res) => {
  try {
    const password = "gmritcms2024";
    const {
      applicationnumber,
      admissionnumber,
      registrationid,
      semesternumber,
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
      permanentaddress,
      permanentpincode,
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

    const hashedpassword = await bcrypt.hash(password, 10);
    console.log("hashedpassword", hashedpassword);

    const query = `
      INSERT INTO studentinfo (
        applicationnumber, admissionnumber, registrationid, joiningdate, nameasperssc,
        studentaadhar, mobile, alternatemobile, personalemail, gender, dob, branch, joiningyear, quota,
        admissiontype, fathername, mothername, fatheraadhar, motheraadhar, scholarshipholder, permanentaddress,
        permanentpincode, currentaddress, currentpincode, moa, remarks, entrancetype, entrancehallticket, rank,
        city, state, nationality, religion, caste, castecategory, studentstatus, studentpassword, semesternumber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const status = 0;
    const values = [
      applicationnumber, admissionnumber, registrationid, joiningdate, nameasperssc,
      studentaadhar, mobile, alternatemobile, personalemail, gender, dob, branch, joiningyear, quota,
      admissiontype, fathername, mothername, fatheraadhar, motheraadhar, scholarshipholder, permanentaddress,
      permanentpincode, currentaddress, currentpincode, moa, remarks, entrancetype, entrancehallticket, rank,
      city, state, nationality, religion, caste, castecategory, status, hashedpassword, semesternumber
    ];

    await connection.query(query, values);
    res.status(200).json({ message: 'Student added successfully', applicationnumber: applicationnumber });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add student', details: err.message });
  }
});

Router.post('/addstudents', adminAuth, upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const password = 'gmritcms2024';
    
    for (const student of data) {
      const {
        applicationnumber,
        admissionnumber,
        registrationid,
        semesternumber,
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
        permanentaddress,
        permanentpincode,
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
      } = student;

      const hashedpassword = await bcrypt.hash(password, 10);
      const query = `
        INSERT INTO studentinfo (
          applicationnumber, admissionnumber, registrationid, joiningdate, nameasperssc,
          studentaadhar, mobile, alternatemobile, personalemail, gender, dob, branch, joiningyear, quota,
          admissiontype, fathername, mothername, fatheraadhar, motheraadhar, scholarshipholder, permanentaddress,
          permanentpincode, currentaddress, currentpincode, moa, remarks, entrancetype, entrancehallticket, rank,
          city, state, nationality, religion, caste, castecategory, studentstatus, studentpassword, semesternumber
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      const values = [
        applicationnumber, admissionnumber, registrationid, joiningdate, nameasperssc,
        studentaadhar, mobile, alternatemobile, personalemail, gender, dob, branch, joiningyear, quota,
        admissiontype, fathername, mothername, fatheraadhar, motheraadhar, scholarshipholder, permanentaddress,
        permanentpincode, currentaddress, currentpincode, moa, remarks, entrancetype, entrancehallticket, rank,
        city, state, nationality, religion, caste, castecategory, 1, hashedpassword, semesternumber
      ];

      await connection.query(query, values);
    }

    res.status(200).json({ message: 'Students added successfully via bulk upload' });
  } catch (err) {
    console.error('Error during bulk upload:', err);
    res.status(500).json({ error: 'Failed to upload students', details: err.message });
  }
});

//Courses

Router.post('/addcourse',adminAuth, async (req, res) => {
  const {
    coursecode,
    coursename,
    alternativename,
    coursedescription,
    coursetype,
    coursecredits,
    learninghours,
    coursecredits2,
    learninghours2,
    branchcode,
  } = req.body;

  try {
    if (coursetype !== 'integrated') {
      const totalcoursecredits = coursecredits; // For lecture and practical, total course credits is the same as course credits

      const insertCourseQuery = `
        INSERT INTO courses 
        (coursecode, coursename, alternativename, coursedescription, coursetype, coursecredits, learninghours, totalcoursecredits, branchcode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await connection.query(insertCourseQuery, [
        coursecode,
        coursename,
        alternativename,
        coursedescription,
        coursetype,
        coursecredits,
        learninghours,
        totalcoursecredits,
        branchcode,
      ]);

    } else if( coursetype === 'integrated') {
      const ctype1 = 'lecture';
      const ctype2 = 'practical';

      const totalcoursecredits = parseFloat(coursecredits) + parseFloat(coursecredits2); // Sum of both course credits

      const insertCourseQuery1 = `
        INSERT INTO courses 
        (coursecode, coursename, alternativename, coursedescription, coursetype, coursecredits, learninghours, totalcoursecredits, branchcode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const insertCourseQuery2 = `
        INSERT INTO courses 
        (coursecode, coursename, alternativename, coursedescription, coursetype, coursecredits, learninghours, totalcoursecredits, branchcode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Inserting the first part of the integrated course
      await connection.query(insertCourseQuery1, [
        coursecode,
        coursename,
        alternativename,
        coursedescription,
        ctype1,
        coursecredits,
        learninghours,
        totalcoursecredits,
        branchcode,
      ]);

      // Inserting the second part of the integrated course
      await connection.query(insertCourseQuery2, [
        coursecode,
        coursename,
        alternativename,
        coursedescription,
        ctype2,
        coursecredits2,
        learninghours2,
        totalcoursecredits,
        branchcode,
      ]);
    } 

    res.status(200).json({ message: 'Course added successfully' });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ error: 'Error adding course' });
  }
});

Router.post('/addcourses/:branchcode', adminAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;

  try {
    // Read the Excel file from the disk
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Iterate through the data array and insert each course into the database
    const branchcode = req.params.branchcode;
    for (const course of data) {
      const {
        coursecode,
        coursename,
        alternativename,
        coursedescription,
        coursetype,
        coursecredits,
        learninghours,
        coursecredits2,
        learninghours2
      } = course;

      if (coursetype !=="integrated") {
        const totalcoursecredits = coursecredits;

        const insertCourseQuery = `
          INSERT INTO courses 
          (coursecode, coursename, alternativename, coursedescription, coursetype, coursecredits, learninghours, totalcoursecredits, branchcode)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.query(insertCourseQuery, [
          coursecode,
          coursename,
          alternativename,
          coursedescription,
          coursetype,
          coursecredits,
          learninghours,
          totalcoursecredits,
          branchcode,
        ]);

      } else if (coursetype === 'integrated') {
        const ctype1 = 'lecture';
        const ctype2 = 'practical';

        const totalcoursecredits = parseFloat(coursecredits) + parseFloat(coursecredits2);

        const insertCourseQuery1 = `
          INSERT INTO courses 
          (coursecode, coursename, alternativename, coursedescription, coursetype, coursecredits, learninghours, totalcoursecredits, branchcode)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const insertCourseQuery2 = `
          INSERT INTO courses 
          (coursecode, coursename, alternativename, coursedescription, coursetype, coursecredits, learninghours, totalcoursecredits, branchcode)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Insert the first part of the integrated course
        await connection.query(insertCourseQuery1, [
          coursecode,
          coursename,
          alternativename,
          coursedescription,
          ctype1,
          coursecredits,
          learninghours,
          totalcoursecredits,
          branchcode,
        ]);

        // Insert the second part of the integrated course
        await connection.query(insertCourseQuery2, [
          coursecode,
          coursename,
          alternativename,
          coursedescription,
          ctype2,
          coursecredits2,
          learninghours2,
          totalcoursecredits,
          branchcode,
        ]);
      }
    }

    res.status(200).json({ message: 'Courses added successfully' });
  } catch (error) {
    console.error('Error adding courses:', error);
    res.status(500).json({ error: 'Error adding courses' });
  }
});

// Get all courses
Router.get('/courses/:branchcode', adminAuth, async (req, res) => {
  const { branchcode } = req.params;
  const { coursecode } = req.query; // Get the coursecode query parameter

  let query = 'SELECT * FROM courses WHERE branchcode = ?';
  let queryParams = [branchcode];

  if (coursecode) {
    query += ' AND coursecode LIKE ?';
    queryParams.push(`%${coursecode}%`);
  }

  try {
    const [results] = await connection.execute(query, queryParams);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching courses:', error);
    res.status(500).send('An error occurred');
  }
});

//downloadcourses
Router.get('/downloadcourses/:branchcode', adminAuth, async (req, res) => {
  const { branchcode } = req.params;

  const query = 'SELECT * FROM courses WHERE branchcode = ?';
  
  try {
    const [results] = await connection.execute(query, [branchcode]);
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

    if (results.length === 1) {
      // Non-integrated course, return all columns
      res.json(results[0]);
    } else if (results.length === 2) {
      // Integrated course, modify coursetype and return the modified response
      const response = {
        ...results[0],
        coursetype: 'integrated', // Modify coursetype to integrated
        coursecredits2: results[1].coursecredits,
        learninghours2: results[1].learninghours,
      };
      res.json(response);
    } else {
      // Handle unexpected cases where the course code has more than 2 entries
      res.status(400).send('Unexpected data structure for the course');
    }
  } catch (error) {
    console.error('An error occurred while fetching the course:', error);
    res.status(500).send('An error occurred');
  }
});

// Update a course by coursecode
Router.put('/updatecourse', adminAuth, async (req, res) => {
  const {
    coursecode,
    coursename,
    alternativename,
    coursedescription,
    coursetype,
    coursecredits,
    learninghours,
    coursecredits2,
    learninghours2,
  } = req.body;

  try {
    // Fetch the existing course details, including branchcode
    const fetchQuery = 'SELECT * FROM courses WHERE coursecode = ?';
    const [fetchResults] = await connection.execute(fetchQuery, [coursecode]);

    if (fetchResults.length === 0) {
      return res.status(404).send('Course not found');
    }

    const currentCourse = fetchResults[0];
    let currentCoursetype;

    if(fetchResults.length === 1){
      currentCoursetype = currentCourse.coursetype;
    }

    if(fetchResults.length === 2){
      currentCoursetype = 'integrated';
    }

    
    
    const branchcode = currentCourse.branchcode;

    // Check if the coursetype has changed
    if (coursetype === currentCoursetype) {
      // No change in coursetype
      if (coursetype === 'integrated') {
        // Update integrated course (two rows)
        await connection.query('DELETE FROM courses WHERE coursecode = ?', [coursecode]);

        const totalcoursecredits = parseFloat(coursecredits) + parseFloat(coursecredits2); // Sum of both course credits

        const insertCourseQuery1 = `
          INSERT INTO courses 
          (coursecode, branchcode, coursename, alternativename, coursedescription, coursetype, coursecredits, learninghours, totalcoursecredits)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertCourseQuery2 = `
          INSERT INTO courses 
          (coursecode, branchcode, coursename, alternativename, coursedescription, coursetype, coursecredits, learninghours, totalcoursecredits)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Insert updated integrated course parts
        await connection.query(insertCourseQuery1, [
          coursecode,
          branchcode,
          coursename,
          alternativename,
          coursedescription,
          'lecture',
          coursecredits,
          learninghours,
          totalcoursecredits,
        ]);
        await connection.query(insertCourseQuery2, [
          coursecode,
          branchcode,
          coursename,
          alternativename,
          coursedescription,
          'practical',
          coursecredits2,
          learninghours2,
          totalcoursecredits,
        ]);
      } else {
        // Update non-integrated course (single row)
        const updateCourseQuery = `
          UPDATE courses
          SET coursename = ?, alternativename = ?, coursedescription = ?, coursecredits = ?, learninghours = ?
          WHERE coursecode = ? AND coursetype = ?
        `;
        await connection.query(updateCourseQuery, [
          coursename,
          alternativename,
          coursedescription,
          coursecredits,
          learninghours,
          coursecode,
          coursetype,
        ]);
      }
    } else {
      // Coursetype has changed
      await connection.query('DELETE FROM courses WHERE coursecode = ?', [coursecode]);

      if (coursetype === 'integrated') {
        // Add two rows for integrated course
        const totalcoursecredits = parseFloat(coursecredits) + parseFloat(coursecredits2);

        const insertCourseQuery1 = `
          INSERT INTO courses 
          (coursecode, branchcode, coursename, alternativename, coursedescription, coursetype, coursecredits, learninghours, totalcoursecredits)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertCourseQuery2 = `
          INSERT INTO courses 
          (coursecode, branchcode, coursename, alternativename, coursedescription, coursetype, coursecredits, learninghours, totalcoursecredits)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.query(insertCourseQuery1, [
          coursecode,
          branchcode,
          coursename,
          alternativename,
          coursedescription,
          'lecture',
          coursecredits,
          learninghours,
          totalcoursecredits,
        ]);
        await connection.query(insertCourseQuery2, [
          coursecode,
          branchcode,
          coursename,
          alternativename,
          coursedescription,
          'practical',
          coursecredits2,
          learninghours2,
          totalcoursecredits,
        ]);
      } else {
        // Add a single row for non-integrated course
        const insertCourseQuery = `
          INSERT INTO courses 
          (coursecode, branchcode, coursename, alternativename, coursedescription, coursetype, coursecredits, learninghours, totalcoursecredits)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.query(insertCourseQuery, [
          coursecode,
          branchcode,
          coursename,
          alternativename,
          coursedescription,
          coursetype,
          coursecredits,
          learninghours,
          coursecredits,
        ]);
      }
    }

    res.status(200).json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Error updating course' });
  }
});

//coursetype count for bar graph 
Router.get('/course-count/:branchcode', adminAuth, async (req, res) => {
  const { branchcode } = req.params;

  const query = `
    SELECT coursecode, COUNT(*) AS count, 
           MAX(coursetype = 'lecture') AS hasLecture, 
           MAX(coursetype = 'practical') AS hasPractical
    FROM courses 
    WHERE branchcode = ? 
    GROUP BY coursecode
  `;

  try {
    const [results] = await connection.execute(query, [branchcode]);

    let lectureCount = 0;
    let practicalCount = 0;
    let integratedCount = 0;

    results.forEach(course => {
      if (course.count === 2) {
        integratedCount++;
      } else if (course.hasLecture) {
        lectureCount++;
      } else if (course.hasPractical) {
        practicalCount++;
      }
    });

    res.json({ lectureCount, practicalCount, integratedCount });
  } catch (error) {
    console.error('An error occurred while counting courses:', error);
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






