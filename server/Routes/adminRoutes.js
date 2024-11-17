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

Router.get('/activesemesters', adminAuth, async (req, res) => {
  const query = 'SELECT * FROM semesters  where semesteractive=1 ORDER BY semesternumber';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching semesters:', error);
    res.status(500).send('An error occurred');
  }
});

// View a specific semester by ID

// Router.get('/semester/:semesterid', adminAuth, async (req, res) => {
//   const { semesterid } = req.params;
//   const query = 'SELECT * FROM semesters WHERE semesterid = ?';

//   try {
//     const [result] = await connection.execute(query, [semesterid]);

//     if (result.length === 0) {
//       return res.status(404).json({ message: 'Semester not found' });
//     }

//     res.json(result[0]); // Send the first result, which should be the single semester
//   } catch (error) {
//     console.error('An error occurred while retrieving the semester:', error);
//     res.status(500).send('An error occurred');
//   }
// });

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

// Router.put('/managesemester/:semesterid', adminAuth, async (req, res) => {
//   const { semesterid } = req.params;
//   const { semesteractive } = req.body;
//   const query = 'UPDATE semesters SET semesteractive = ? WHERE semesterid = ?';

//   try {
//     await connection.execute(query, [semesteractive, semesterid]);
//     res.json({ message: 'Semester status updated successfully' });
//   } catch (error) {
//     console.error('An error occurred while updating semester status:', error);
//     res.status(500).send('An error occurred');
//   }
// });

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

// Backend route to get courses by branchcode
Router.get('/courses/:branchcode', adminAuth, async (req, res) => {
  const { branchcode } = req.params;
  const query = 'SELECT DISTINCT coursecode FROM courses WHERE branchcode = ?';

  try {
    const [results] = await connection.execute(query, [branchcode]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Error fetching courses');
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


//curriculum routes 

Router.post('/addcurriculum', adminAuth, async (req, res) => {
  const { coursecode, branchcode, semesternumber, coursetype } = req.body;

  try {
    const insertCurriculumQuery = `
      INSERT INTO curriculum (coursecode, branchcode, semesternumber, coursetype)
      VALUES (?, ?, ?, ?)
    `;

    await connection.query(insertCurriculumQuery, [coursecode, branchcode, semesternumber, coursetype]);

    res.status(200).json({ message: 'Curriculum added successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Curriculum with the same coursecode, branchcode, and semesternumber already exists' });
    }
    console.error('Error adding curriculum:', error);
    res.status(500).json({ error: 'Error adding curriculum' });
  }
});

Router.get('/viewcurriculum/:branchcode/:semesternumber', adminAuth, async (req, res) => {
  const { branchcode, semesternumber } = req.params;

  try {
    const getCurriculumQuery = `SELECT * FROM curriculum WHERE branchcode = ? AND semesternumber = ?`;

    const [results] = await connection.query(getCurriculumQuery, [branchcode, semesternumber]);

    if (results.length === 0) {
      // console.log("no curriculum found");
      return res.status(404).json({ error: 'No curriculum found for the specified branch and semester' });
    } 

    res.status(200).json(results); // Return all curriculum entries matching branchcode and semesternumber
  } catch (error) {
    console.error('Error fetching curriculum:', error);
    res.status(500).json({ error: 'Error fetching curriculum' });
  }
});

Router.get('/curriculum/:curriculumid', adminAuth, async (req, res) => {
  const { curriculumid } = req.params;

  try {
    const selectCurriculumQuery = `
      SELECT * FROM curriculum WHERE curriculumid = ?
    `;

    const [result] = await connection.query(selectCurriculumQuery, [curriculumid]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Curriculum not found' });
    }

    res.status(200).json(result[0]); // Send the curriculum data
  } catch (error) {
    console.error('Error fetching curriculum data:', error);
    res.status(500).json({ error: 'Error fetching curriculum data' });
  }
});

Router.put('/updatecurriculum/:curriculumid', adminAuth, async (req, res) => {
  const { curriculumid } = req.params;
  const { coursecode, branchcode, semesternumber, coursetype } = req.body;

  try {
    const updateCurriculumQuery = `
      UPDATE curriculum 
      SET coursecode = ?, branchcode = ?, semesternumber = ?, coursetype = ?
      WHERE curriculumid = ?
    `;

    const [result] = await connection.query(updateCurriculumQuery, [coursecode, branchcode, semesternumber, coursetype, curriculumid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Curriculum not found' });
    }

    res.status(200).json({ message: 'Curriculum updated successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Send the error message for duplicate entries
      return res.status(400).json({
        error: `Duplicate entry '${coursecode}-${branchcode}-${semesternumber}' for key 'PRIMARY'`,
      });
    }
    console.error('Error updating curriculum:', error);
    res.status(500).json({ error: 'Error updating curriculum' });
  }
});

Router.delete('/deletecurriculum/:curriculumid', adminAuth, async (req, res) => {
  const { curriculumid } = req.params;

  try {
    const deleteCurriculumQuery = `DELETE FROM curriculum WHERE curriculumid = ?`;

    const [result] = await connection.query(deleteCurriculumQuery, [curriculumid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Curriculum not found' });
    }

    res.status(200).json({ message: 'Curriculum deleted successfully' });
  } catch (error) {
    console.error('Error deleting curriculum:', error);
    res.status(500).json({ error: 'Error deleting curriculum' });
  }
});

//faculty routes 

Router.post('/addfaculties', adminAuth, upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const defaultPassword = 'faculty2024'; // Default password for new faculty
    const skippedFacultyCodes = []; // To keep track of duplicates

    for (const faculty of data) {
      const {
        gender,
        age,
        maritalstatus,
        religion,
        caste,
        facultycode,
        facultyname,
        facultyemail,
        facultynumber,
        facultydesignation,
        facultybranch,
        facultyqualifications,
        facultyaddress,
        facultyexperience,
        facultysalary,
        joiningyear,
        dob,
        facultytype
      } = faculty;

      // Check if the facultycode already exists
      const [existingFaculty] = await connection.query(
        'SELECT 1 FROM faculty WHERE facultycode = ?',
        [facultycode]
      );

      if (existingFaculty.length > 0) {
        // If facultycode exists, add it to the skipped list and continue
        skippedFacultyCodes.push(facultycode);
        continue;
      }

      // Hash the default password
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Insert new faculty record
      const query = `
        INSERT INTO faculty (
          gender, age, maritalstatus, religion, caste, facultycode, facultyname,
          facultyemail, facultynumber, facultydesignation, facultybranch, 
          facultyqualifications, facultyaddress, facultyexperience, facultysalary, 
          joiningyear, dob, facultytype, password
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        gender, age, maritalstatus, religion, caste, facultycode, facultyname,
        facultyemail, facultynumber, facultydesignation, facultybranch,
        facultyqualifications, facultyaddress, facultyexperience, facultysalary,
        joiningyear, dob, facultytype, hashedPassword
      ];

      await connection.query(query, values);
    }

    // Construct response message
    let message = 'Faculty members added successfully via bulk upload';
    if (skippedFacultyCodes.length > 0) {
      message += `. The following faculty codes were skipped because they already exist: ${skippedFacultyCodes.join(', ')}`;
    }

    res.status(200).json({ message });
  } catch (err) {
    console.error('Error during faculty bulk upload:', err);
    res.status(500).json({ error: 'Failed to upload faculty members', details: err.message });
  }
});

Router.get('/faculty/search', adminAuth, async (req, res) => {
  const { searchBy, keyword } = req.query; // Get search type and keyword from query parameters

  // Base query to fetch faculty details
  let query = 'SELECT * FROM faculty';
  let queryParams = [];

  // Conditionally modify the query based on search type
  if (searchBy === 'facultycode') {
    query += ' WHERE facultycode LIKE ?';
    queryParams.push(`%${keyword}%`);
  } else if (searchBy === 'facultyname') {
    query += ' WHERE facultyname LIKE ?';
    queryParams.push(`%${keyword}%`);
  } else {
    return res.status(400).json({ message: 'Invalid search type. Use "facultycode" or "facultyname".' });
  }

  try {
    const [results] = await connection.execute(query, queryParams);
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching faculty:', error);
    res.status(500).send('An error occurred');
  }
});

// shadow routes ;

// section routes 
//Section Routes
//Add Section
Router.post('/addsection', adminAuth, async (req, res) => {
  const { sectionname, sectionstrength, branchcode, semesternumber } = req.body;

  // Validate that no field is undefined
  if (!sectionname || !sectionstrength || !branchcode || !semesternumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Fetch the branch shortcut using branchcode
    const branchQuery = 'SELECT branchshortcut FROM branches WHERE branchcode = ?';
    const [branch] = await connection.execute(branchQuery, [branchcode]);

    if (branch.length === 0) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const branchshortcut = branch[0].branchshortcut;

    // Generate sectioncode in the format "semesternumber-branchshortcut-sectionname"
    const sectioncode = `${semesternumber}-${branchshortcut}-${sectionname}`;

    // Insert the new section into the database
    const insertQuery = `
      INSERT INTO sections (sectioncode, sectionname, sectionstrength, branchcode, semesternumber)
      VALUES (?, ?, ?, ?, ?)`;
    
    await connection.execute(insertQuery, [sectioncode, sectionname, sectionstrength, branchcode, semesternumber]);

    res.status(201).json({ message: 'Section added successfully', sectioncode });
  } catch (error) {
    console.error('Error while adding the section:', error);
    res.status(500).send('An error occurred');
  }
});

//Update Section
Router.put('/updatesection/:sectioncode', adminAuth, async (req, res) => {
  const { sectioncode } = req.params;
  const { sectionname, sectionstrength} = req.body;

  try {
    const query = `
      UPDATE sections 
      SET sectionname = ?, sectionstrength = ?
      WHERE sectioncode = ?`;

    const [result] = await connection.execute(query, [sectionname, sectionstrength,  sectioncode]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.status(200).json({ message: 'Section updated successfully' });
  } catch (error) {
    console.error('Error while updating the section:', error);
    res.status(500).send('An error occurred');
  }
});

//View Section
Router.get('/section/:sectioncode', adminAuth, async (req, res) => {
  const { sectioncode } = req.params;

  try {
    const query = 'SELECT * FROM sections WHERE sectioncode = ?';
    const [section] = await connection.execute(query, [sectioncode]);

    if (section.length === 0) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.status(200).json(section[0]);
  } catch (error) {
    console.error('Error while fetching the section:', error);
    res.status(500).send('An error occurred');
  }
});

//Delete Section
Router.delete('/deletesection/:sectioncode', adminAuth, async (req, res) => {
  const { sectioncode } = req.params;

  try {
    const query = 'DELETE FROM sections WHERE sectioncode = ?';
    const [result] = await connection.execute(query, [sectioncode]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error while deleting the section:', error);
    res.status(500).send('An error occurred');
  }
});

//getting the student details using sectioncode
Router.get('/sectionstudents/:sectioncode', adminAuth, async (req, res) => {
  const { sectioncode } = req.params;
  const query = `SELECT registrationid,nameasperssc FROM studentinfo WHERE sectioncode = ?`;

  try {
    const [students] = await connection.execute(query, [sectioncode]);

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for the provided section code.' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('An error occurred while fetching student details:', error);
    res.status(500).send('An error occurred');
  }
});

//to fetch sections of selected semester 
Router.get('/sections/:semesternumber/:branchcode', adminAuth, async (req, res) => {
  const { semesternumber, branchcode } = req.params;

  const query = 'SELECT sectioncode FROM sections WHERE semesternumber = ? AND branchcode = ?';

  try {
    const [results] = await connection.execute(query, [semesternumber, branchcode]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No sections found for the selected semester and branch.' });
    }
    res.json(results);
  } catch (error) {
    console.error('An error occurred while fetching sections for the selected semester and branch:', error);
    res.status(500).send('An error occurred');
  }
});




// Router.get('/sectionstudentsbysemester/:sectioncode', adminAuth, async (req, res) => {
//   const { sectioncode } = req.params;
  
//   // Split the single parameter (e.g., '7-CSE-B') into semesternumber, branchshortcut, and sectionname
//   const [semesternumber, branchshortcut, sectionname] = sectioncode.split('-');

//   const snumber = parseInt(semesternumber, 10);

//   try {
//     // Step 1: Get the branchcode using the branchshortcut from the branches table
//     const branchQuery = `SELECT branchcode FROM branches WHERE branchshortcut = ?`;
//     const [branchResult] = await connection.execute(branchQuery, [branchshortcut]);

//     if (branchResult.length === 0) {
//       return res.status(404).json({ message: 'Branch not found for the provided branch shortcut.' });
//     }

//     const branchcode = branchResult[0].branchcode;

//     // Step 2: Fetch students' registrationid and nameasperssc from the studentinfo table using semesternumber and branchcode
//     const studentQuery = `
//       SELECT registrationid, nameasperssc, semesternumber, branch 
//       FROM studentinfo 
//       WHERE branch = ? AND semesternumber = ?
//     `;
//     const [students] = await connection.execute(studentQuery, [branchcode, snumber]);

//     if (students.length === 0) {
//       return res.status(404).json({ message: 'No students found for the provided semester number, branch code, and section name.' });
//     }

//     // Return the student details
//     res.status(200).json(students);
//   } catch (error) {
//     console.error('An error occurred while fetching student details:', error);
//     res.status(500).send('An error occurred');
//   }
// });



// Fetch Sections by Branch Code and Semester Number

Router.get('/sectionstudentsbysemester/:sectioncode', adminAuth, async (req, res) => {
  const { sectioncode } = req.params;

  // Split the single parameter (e.g., '7-CSE-B') into semesternumber, branchshortcut, and sectionname
  const [semesternumber, branchshortcut, sectionname] = sectioncode.split('-');

  const snumber = parseInt(semesternumber, 10);

  try {
    // Step 1: Get the branchcode using the branchshortcut from the branches table
    const branchQuery = `SELECT branchcode FROM branches WHERE branchshortcut = ?`;
    const [branchResult] = await connection.execute(branchQuery, [branchshortcut]);

    if (branchResult.length === 0) {
      return res.status(404).json({ message: 'Branch not found for the provided branch shortcut.' });
    }

    const branchcode = branchResult[0].branchcode;

    // Step 2: Fetch students' registrationid, nameasperssc, and sectioncode from the studentinfo table using semesternumber and branchcode
    const studentQuery = `
      SELECT registrationid, nameasperssc, semesternumber, branch, sectioncode
      FROM studentinfo 
      WHERE branch = ? AND semesternumber = ?`;
    const [students] = await connection.execute(studentQuery, [branchcode, snumber]);
    console.log(students);
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for the provided semester number, branch code, and section name.' });
    }

    // Return the student details
    res.status(200).json(students);
  } catch (error) {
    console.error
  }});

Router.get('/section/:branchcode/:semesternumber', adminAuth, async (req, res) => {
  const { branchcode, semesternumber } = req.params;

  try {
    const query = `
      SELECT * FROM sections 
      WHERE branchcode = ? AND semesternumber = ?`;
    const [sections] = await connection.execute(query, [branchcode, semesternumber]);

    if (sections.length === 0) {
      return res.status(404).json({ message: 'No sections found for this branch and semester' });
    }

    res.status(200).json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/semester/:semesternumber', adminAuth, async (req, res) => {
  const { semesternumber } = req.params;

  let query = 'SELECT * FROM semesters WHERE semesternumber = ?';
  let queryParams = [semesternumber];

  try {
    const [results] = await connection.execute(query, queryParams);
    if (results.length === 0) {
      return res.status(404).send('Semester not found');
    }
    res.json(results[0]);
  } catch (error) {
    console.error('An error occurred while fetching semester details:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/studentcount/:semesternumber', adminAuth, async (req, res) => {
  const { semesternumber } = req.params;

  // Query to fetch students grouped by branch shortcut for the given semesternumber
  const query = `
    SELECT b.branchshortcut, COUNT(si.stdid) AS studentCount 
    FROM studentinfo si
    JOIN branches b ON si.branch = b.branchcode 
    WHERE si.semesternumber = ? 
    GROUP BY b.branchshortcut
  `;

  try {
    const [results] = await connection.execute(query, [semesternumber]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No students found for this semester' });
    }

    res.json(results); // Send grouped student count by branch shortcut
  } catch (error) {
    console.error('An error occurred while fetching students:', error);
    res.status(500).send('An error occurred');
  }
});

Router.put('/managesemester/:semesternumber', adminAuth, async (req, res) => {
  const { semesternumber } = req.params;
  const { semesteractive } = req.body;

  let query = 'UPDATE semesters SET semesteractive = ? WHERE semesternumber = ?';
  let queryParams = [semesteractive, semesternumber];

  try {
    const [result] = await connection.execute(query, queryParams);
    if (result.affectedRows === 0) {
      return res.status(404).send('Semester not found');
    }
    res.send('Semester status updated successfully');
  } catch (error) {
    console.error('An error occurred while updating semester status:', error);
    res.status(500).send('An error occurred');
  }
});

Router.post('/promotestudents/:semesternumber', adminAuth, async (req, res) => {
  const { semesternumber } = req.params;

  // console.log()

  if (!semesternumber) {
    return res.status(400).json({ message: 'Semester number is required' });
  }

  try {
    // Fetch the semester details
    const semesterQuery = 'SELECT enddate FROM semesters WHERE semesternumber = ? AND semesteractive = 1';
    const [semester] = await connection.execute(semesterQuery, [semesternumber]);

    if (semester.length === 0) {
      return res.status(404).json({ message: 'Semester not found or inactive' });
    }

    const endDate = semester[0].enddate;
    const currentDate = new Date();

    // Check if current date is greater than the semester's end date
    if (currentDate <= new Date(endDate)) {
      return res.status(400).json({ message: 'Cannot promote students before semester end date' });
    }

    // Promote only active students (studentstatus = 1) for the given semester
    const promoteQuery = `
      UPDATE studentinfo
      SET semesternumber = semesternumber + 1
      WHERE semesternumber = ? AND studentstatus = 1
    `;

    const [result] = await connection.execute(promoteQuery, [semesternumber]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No active students found to promote' });
    }

    res.status(200).json({ message: 'Students promoted successfully' });
  } catch (error) {
    console.error('Error promoting students:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get('/studentbysemester/:semesternumber', adminAuth, async (req, res) => {
  const { semesternumber } = req.params;

  if (!semesternumber) {
    return res.status(400).json({ message: 'Semester number is required' });
  }

  try {
    // Fetch active students and their branch shortcut for the given semester
    const query = `
      SELECT s.registrationid, 
             s.nameasperssc, 
             b.branchshortcut
      FROM studentinfo s
      JOIN branches b ON s.branch = b.branchcode
      WHERE s.semesternumber = ? AND s.studentstatus = 1
      ORDER BY b.branchshortcut
    `;

    const [students] = await connection.execute(query, [semesternumber]);

    if (students.length === 0) {
      return res.status(404).json({ message: 'No active students found for this semester' });
    }

    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('An error occurred');
  }
});

//mapping the  sectioncode in students table 
Router.post('/mapstudenttosection/:sectioncode', adminAuth, async (req, res) => {
  const { sectioncode } = req.params;
  const { registrationid } = req.body; // Get registrationid from the request body

  // Ensure all required parameters are present
  if (!sectioncode || !registrationid) {
    return res.status(400).json({ message: 'Section code and registrationid are required' });
  }

  try {
    // Directly update the sectioncode for the student with the given registrationid
    const updateQuery = `
      UPDATE studentinfo
      SET sectioncode = ?
      WHERE registrationid = ?
    `;
    const [result] = await connection.execute(updateQuery, [sectioncode, registrationid]);

    // If no rows are updated, return an error
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No student found to update section code' });
    }

    res.status(200).json({ message: 'Section code updated successfully for the student', updatedRows: result.affectedRows });
  } catch (error) {
    console.error('Error updating section code:', error);
    res.status(500).send('An error occurred while updating section code');
  }
});

//bulk mapping of students to section 
Router.post('/mapstudentstosection/:sectioncode', adminAuth, async (req, res) => {
  const { sectioncode } = req.params;
  const { registrationids } = req.body; // Expect an array of registrationids

  // Ensure all required parameters are present
  if (!sectioncode || !registrationids || !Array.isArray(registrationids) || registrationids.length === 0) {
    return res.status(400).json({ message: 'Section code and an array of registrationids are required' });
  }

  try {
    // Flatten the array of registrationids into a format MySQL understands
    const placeholders = registrationids.map(() => '?').join(',');
    console.log(placeholders) // Creates a series of `?` placeholders
    const values = [sectioncode, ...registrationids]; // Array of values for query
    console.log(values);
    // Update the sectioncode for all students with the given registrationids
    const updateQuery = `
      UPDATE studentinfo
      SET sectioncode = ?
      WHERE registrationid IN (${placeholders})
    `;
    
    const [result] = await connection.execute(updateQuery, values);

    // If no rows are updated, return an error
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No students found to update section code' });
    }

    res.status(200).json({ message: 'Section code updated successfully for the students', updatedRows: result.affectedRows });
  } catch (error) {
    console.error('Error updating section code:', error);
    res.status(500).send('An error occurred while updating section code');
  }
});

//class schedule routes 

Router.post('/classschedule', adminAuth, async (req, res) => {
  const { facultycode, sectioncode, coursecode, day, starttime, endtime } = req.body;

  try {
    const query = `
      INSERT INTO classschedule (facultycode, sectioncode, coursecode, day, starttime, endtime)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [facultycode, sectioncode, coursecode, day, starttime, endtime]);

    res.status(201).json({ message: `${coursecode} Class schedule created successfully for ${sectioncode}` });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Failed to create class schedule. Please try again later.' });
  }
});

Router.put('/classschedule/:scheduleid', adminAuth, async (req, res) => {
  const { scheduleid } = req.params;
  const { starttime, endtime } = req.body;

  try {
    const query = `
      UPDATE classschedule
      SET starttime = ?, endtime = ?
      WHERE scheduleid = ?
    `;
    const [result] = await connection.execute(query, [starttime, endtime, scheduleid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Schedule not found. No update made.' });
    }

    res.status(200).json({ message: 'Class schedule updated successfully.' });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Failed to update class schedule. Please try again later.' });
  }
});

Router.get('/classschedule/:sectioncode/:day', adminAuth, async (req, res) => {
  const { sectioncode, day } = req.params;

  try {
    const query = `SELECT * FROM classschedule WHERE sectioncode = ? AND day = ?`;
    const [schedules] = await connection.execute(query, [sectioncode, day]);

    if (schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this section and day.' });
    }

    res.status(200).json({ message: 'Schedules fetched successfully.', data: schedules });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Failed to fetch schedules. Please try again later.' });
  }
});

Router.delete('/classschedule/:scheduleid', adminAuth, async (req, res) => {
  const { scheduleid } = req.params;

  try {
    const query = `DELETE FROM classschedule WHERE scheduleid = ?`;
    const [result] = await connection.execute(query, [scheduleid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Schedule not found. No deletion made.' });
    }

    res.status(200).json({ message: 'Class schedule deleted successfully.' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Failed to delete class schedule. Please try again later.' });
  }
});

//getting all the courses of the faculty 
Router.get('/classes/faculty/:facultycode', adminAuth, async (req, res) => {
  const { facultycode } = req.params;

  try {
    const query = `
      SELECT * FROM classschedule 
      WHERE facultycode = ?
    `;
    const [classes] = await connection.execute(query, [facultycode]);

    if (classes.length === 0) {
      return res.status(404).json({ message: 'No classes found for this faculty.' });
    }

    res.status(200).json({ message: 'Classes fetched successfully.', data: classes });
  } catch (error) {
    console.error('Error fetching classes for faculty:', error);
    res.status(500).json({ message: 'Failed to fetch classes. Please try again later.' });
  }
});


//attendance session routes 


Router.post('/attendancesession', adminAuth, async (req, res) => {
  const { scheduleid, date, starttime, endtime, status = 'Open' } = req.body;

  try {
    const query = `
      INSERT INTO attendancesession (scheduleid, date, starttime, endtime, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [scheduleid, date, starttime, endtime, status]);

    res.status(201).json({ message: 'Attendance session created successfully.' });
  } catch (error) {
    console.error('Error creating attendance session:', error);
    res.status(500).json({ message: 'Failed to create attendance session. Please try again later.' });
  }
});


Router.get('/attendancesession/schedule/:scheduleid', adminAuth, async (req, res) => {
  const { scheduleid } = req.params;

  try {
    const query = `SELECT * FROM attendancesession WHERE scheduleid = ?`;
    const [sessions] = await connection.execute(query, [scheduleid]);

    if (sessions.length === 0) {
      return res.status(404).json({ message: 'No attendance sessions found for this schedule.' });
    }

    res.status(200).json({ message: 'Attendance sessions fetched successfully.', data: sessions });
  } catch (error) {
    console.error('Error fetching attendance sessions:', error);
    res.status(500).json({ message: 'Failed to fetch attendance sessions. Please try again later.' });
  }
});


Router.get('/attendancesession/:sessionid', adminAuth, async (req, res) => {
  const { sessionid } = req.params;

  try {
    const query = `SELECT * FROM attendancesession WHERE sessionid = ?`;
    const [session] = await connection.execute(query, [sessionid]);

    if (session.length === 0) {
      return res.status(404).json({ message: 'Attendance session not found.' });
    }

    res.status(200).json({ message: 'Attendance session details fetched successfully.', data: session });
  } catch (error) {
    console.error('Error fetching attendance session details:', error);
    res.status(500).json({ message: 'Failed to fetch attendance session details. Please try again later.' });
  }
});


Router.put('/attendancesession/:sessionid', adminAuth, async (req, res) => {
  const { sessionid } = req.params;
  const { date, starttime, endtime, status } = req.body;

  try {
    const query = `
      UPDATE attendancesession 
      SET date = ?, starttime = ?, endtime = ?, status = ? 
      WHERE sessionid = ?
    `;
    const [result] = await connection.execute(query, [date, starttime, endtime, status, sessionid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Attendance session not found.' });
    }

    res.status(200).json({ message: 'Attendance session updated successfully.' });
  } catch (error) {
    console.error('Error updating attendance session:', error);
    res.status(500).json({ message: 'Failed to update attendance session. Please try again later.' });
  }
});


Router.delete('/attendancesession/:sessionid', adminAuth, async (req, res) => {
  const { sessionid } = req.params;

  try {
    const query = `DELETE FROM attendancesession WHERE sessionid = ?`;
    const [result] = await connection.execute(query, [sessionid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Attendance session not found.' });
    }

    res.status(200).json({ message: 'Attendance session deleted successfully.' });
  } catch (error) {
    console.error('Error deleting attendance session:', error);
    res.status(500).json({ message: 'Failed to delete attendance session. Please try again later.' });
  }
});


//attendence routes 

//mark attendence 
Router.post('/attendance', adminAuth, async (req, res) => {
  const { sessionid, registrationid, status } = req.body;

  try {
    const query = `
      INSERT INTO attendance (sessionid, registrationid, status)
      VALUES (?, ?, ?)
    `;
    await connection.execute(query, [sessionid, registrationid, status]);

    res.status(201).json({ message: 'Attendance marked successfully.' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Failed to mark attendance. Please try again later.' });
  }
});

Router.get('/attendance/:sessionid', adminAuth, async (req, res) => {
  const { sessionid } = req.params;

  try {
    const query = `SELECT * FROM attendance WHERE sessionid = ?`;
    const [attendance] = await connection.execute(query, [sessionid]);

    if (attendance.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this session.' });
    }

    res.status(200).json({ message: 'Attendance records fetched successfully.', data: attendance });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ message: 'Failed to fetch attendance records. Please try again later.' });
  }
});


Router.put('/attendance/:sessionid/:registrationid', adminAuth, async (req, res) => {
  const { sessionid, registrationid } = req.params;
  const { status } = req.body;

  try {
    const query = `
      UPDATE attendance
      SET status = ?
      WHERE sessionid = ? AND registrationid = ?
    `;
    const [result] = await connection.execute(query, [status, sessionid, registrationid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Attendance record not found. No update made.' });
    }

    res.status(200).json({ message: 'Attendance updated successfully.' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Failed to update attendance. Please try again later.' });
  }
});


Router.delete('/attendance/:sessionid/:registrationid', adminAuth, async (req, res) => {
  const { sessionid, registrationid } = req.params;

  try {
    const query = `DELETE FROM attendance WHERE sessionid = ? AND registrationid = ?`;
    const [result] = await connection.execute(query, [sessionid, registrationid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Attendance record not found. No deletion made.' });
    }

    res.status(200).json({ message: 'Attendance record deleted successfully.' });
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    res.status(500).json({ message: 'Failed to delete attendance record. Please try again later.' });
  }
});


//adding schedule 
// Route to add a schedule in the classschedule table
Router.post('/classschedule/add', adminAuth, async (req, res) => {
  const {
    facultycode,
    sectioncode,
    day,
    scheduledate,
    starttime,
    endtime,
    coursecode,
    repeatType, // 'none' or 'repeat'
    endDate // if repeating, this defines the end of recurrence
  } = req.body;

  try {
    // Function to add a single schedule entry
    const addSchedule = async (scheduledate) => {
      await connection.execute(
        `INSERT INTO classschedule 
          (facultycode, sectioncode, day, scheduledate, starttime, endtime, coursecode) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [facultycode, sectioncode, day, scheduledate, starttime, endtime, coursecode]
      );
    };

    // Determine if repeat is needed
    if (repeatType === 'none') {
      await addSchedule(scheduledate);
    } else {
      let currentDate = new Date(scheduledate);
      const endDateObject = new Date(endDate);

      // Repeat weekly until the end date
      while (currentDate <= endDateObject) {
        await addSchedule(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 7); // Weekly increment
      }
    }

    res.json({ message: 'Schedule added successfully' });
  } catch (error) {
    console.error('Error adding schedule:', error);
    res.status(500).json({ error: 'Failed to add schedule' });
  }
});

//getting schedule details based on facultycode and sectioncode 
// Backend route to fetch the classes
// Router.get('/facultyclasses', adminAuth, async (req, res) => {
//   const { facultycode, semesternumber, branchcode } = req.query;

//   try {
//     // Fetch section codes based on the provided semester and branch
//     const sectionQuery = `SELECT sectioncode FROM sections WHERE branchcode = ? AND semesternumber = ?`;
//     const [sections] = await connection.execute(sectionQuery, [branchcode, semesternumber]);
//     const sectionCodes = sections.map((section) => section.sectioncode);

//     if (sectionCodes.length === 0) {
//       return res.status(404).json({ message: 'No sections found for the provided branch and semester.' });
//     }

//     // Fetch classes from classschedule based on faculty and sections
//     const scheduleQuery = `
//       SELECT day, starttime, endtime, sectioncode 
//       FROM classschedule 
//       WHERE facultycode = ? AND sectioncode IN (?) 
//     `;
//     const [schedules] = await connection.execute(scheduleQuery, [facultycode, sectionCodes]);

//     res.status(200).json(schedules);
//   } catch (error) {
//     console.error('Error fetching classes:', error);
//     res.status(500).json({ error: 'Failed to fetch classes' });
//   }
// });

// Router.get('/facultyclasses', adminAuth, async (req, res) => {
//   const { facultycode, semesternumber, branchcode } = req.query;

//   // Log the parameters for debugging
//   console.log("Received parameters:", { facultycode, semesternumber, branchcode });

//   // Validate that all required parameters are provided
//   if (!facultycode || !semesternumber || !branchcode) {
//     return res.status(400).json({ error: "Missing required parameters: facultycode, semesternumber, or branchcode" });
//   }

//   try {
//     // Step 1: Fetch section codes based on semester and branch
//     const sectionQuery = `SELECT sectioncode FROM sections WHERE branchcode = ? AND semesternumber = ?`;
//     const [sections] = await connection.execute(sectionQuery, [branchcode, semesternumber]);
//     console.log(sections);
//     const sectionCodes = sections.map((section) => section.sectioncode);

//     if (sectionCodes.length === 0) {
//       return res.status(404).json({ message: 'No sections found for the provided branch and semester.' });
//     }

//     // Step 2: Fetch classes based on faculty and sections
//     const scheduleQuery = `
//       SELECT day, starttime, endtime, sectioncode 
//       FROM classschedule 
//       WHERE facultycode = ? AND sectioncode IN (?) 
//     `;
//     const [schedules] = await connection.execute(scheduleQuery, [facultycode, sectionCodes]);
//     console.log(schedules);

//     res.status(200).json(schedules);
//   } catch (error) {
//     console.error('Error fetching classes:', error);
//     res.status(500).json({ error: 'Failed to fetch classes' });
//   }
// });

Router.get('/facultyclasses', adminAuth, async (req, res) => {
  const { facultycode, semesternumber, branchcode } = req.query;

  try {
    // Step 1: Fetch the section code using semesternumber and branchcode from the sections table
    const sectionQuery = `SELECT sectioncode FROM sections WHERE semesternumber = ? AND branchcode = ?`;
    const [sectionResults] = await connection.execute(sectionQuery, [semesternumber, branchcode]);

    if (sectionResults.length === 0) {
      console.log('No sections found for the provided semesternumber and branchcode');
      return res.status(404).json({ message: 'No sections found' });
    }

    const sectioncode = sectionResults[0].sectioncode;
    console.log(`Section Code Found: ${sectioncode}`);

    // Step 2: Fetch classes from classschedule using the facultycode and sectioncode
    const classesQuery = `
      SELECT day, starttime, endtime, coursecode, scheduledate 
      FROM classschedule 
      WHERE facultycode = ? AND sectioncode = ?
    `;
    const [classResults] = await connection.execute(classesQuery, [facultycode, sectioncode]);

    if (classResults.length === 0) {
      console.log('No classes found for the provided facultycode and sectioncode');
      return res.status(404).json({ message: 'No classes found' });
    }

    console.log(`Classes Found:`, classResults);
    res.status(200).json(classResults);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).send('An error occurred while fetching classes');
  }
});












export default Router;






