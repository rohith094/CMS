import express from "express";
import connection from '../db.js';
import StudentLogin from './StudentLogin.js';
import authRoute from "./authRoute.js";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

const Router = express.Router();


Router.use("/", StudentLogin);

const generateOTP = () => {
  // Define the length of the OTP
  const otpLength = 6;

  // Generate a random numeric string of specified length
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < otpLength; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }

  return otp;
};


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mendarohithkumarr@gmail.com',
    pass: 'czfg myjh ztfq zlvo'

  }
});



// Route to get course details for the logged-in student based on their registration ID
Router.get('/courses', authRoute, async (req, res) => {
  const studentEmail = req.user; // req.user contains the decoded student email from the token

  try {
    // Step 1: Get student's registrationid from studentinfo table using the email
    const getRegistrationIdQuery = `
      SELECT registrationid 
      FROM studentinfo 
      WHERE personalemail = ?
    `;

    const [registrationResult] = await connection.query(getRegistrationIdQuery, [studentEmail]);

    // If no student found, return 404
    if (registrationResult.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { registrationid } = registrationResult[0];

    // Step 2: Get branchcode and semesternumber using the registrationid
    const getStudentInfoQuery = `
      SELECT branch, semesternumber 
      FROM studentinfo 
      WHERE registrationid = ?
    `;

    const [studentInfoResult] = await connection.query(getStudentInfoQuery, [registrationid]);

    // If no info found, return 404
    if (studentInfoResult.length === 0) {
      return res.status(404).json({ error: 'No information found for the student' });
    }

    const { branch, semesternumber } = studentInfoResult[0];

    // Step 3: Fetch courses for the student's semester from the curriculum table
    const getCoursesQuery = `
      SELECT c.coursecode, c.coursetype, cu.coursename, cu.coursedescription, cu.coursecredits, cu.learninghours, cu.totalcoursecredits 
      FROM curriculum AS c
      JOIN courses AS cu ON c.coursecode = cu.coursecode 
      WHERE c.semesternumber = ? AND c.branchcode = ?
    `;

    const [courses] = await connection.query(getCoursesQuery, [semesternumber, branch]);

    // If no courses found, return 404
    if (courses.length === 0) {
      return res.status(404).json({ error: 'No courses found for the student\'s semester and branch' });
    }

    // Return the courses with details for the student's semester
    res.status(200).json(courses);
  } catch (error) {
    // Log error and return 500 status
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});



Router.get('/singlestudent', authRoute, async (req, res) => {
  const query = 'SELECT * FROM studentinfo WHERE personalemail = ?';

  try {
    const [results] = await connection.execute(query, [req.user]);
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(results[0]);
  } catch (error) {
    console.error('An error occurred while fetching user details:', error);
    res.status(500).send('An error occurred');
  }
});

Router.post('/feedback', authRoute, async (req, res) => {
  const { message } = req.body;
  const email = req.user;
  console.log(message);

  const now = new Date();

  // Extract the date components
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Zero-pad month
  const day = String(now.getDate()).padStart(2, '0'); // Zero-pad day

  // Extract the time components
  const hours = String(now.getHours()).padStart(2, '0'); // Zero-pad hours
  const minutes = String(now.getMinutes()).padStart(2, '0'); // Zero-pad minutes
  const seconds = String(now.getSeconds()).padStart(2, '0'); // Zero-pad seconds

  // Format the date and time
  const currentDate = `${year}-${month}-${day}`;
  const currentTime = `${hours}:${minutes}:${seconds}`;

  if (!message) {
    return res.status(400).send('Missing required fields');
  }

  const selectJntunoQuery = 'SELECT jntuno FROM students WHERE email = ?';
  const checkFeedbackQuery = 'SELECT * FROM feedbacks WHERE jntuno = ?';
  const insertFeedbackQuery = 'INSERT INTO feedbacks (jntuno, fmessage, ftime, fdate) VALUES (?,?,?,?)';
  const seenquery = 'SELECT seen FROM feedbacks WHERE jntuno = ? ORDER BY feedback_id DESC LIMIT 1';


  try {
    const [studentResults] = await connection.execute(selectJntunoQuery, [email]);

    if (studentResults.length === 0) {
      return res.status(404).send('User not found');
    }

    const jntuno = studentResults[0].jntuno;

    // Check if feedback already exists for this student
    const [feedbackResults] = await connection.execute(checkFeedbackQuery, [jntuno]);
    const [feebbackseenresults] = await connection.execute(seenquery, [jntuno]);

    if (feedbackResults.length > 0 && feebbackseenresults[0].seen === 0) {
      return res.status(409).send('You have already submitted your feedback.');
    }

    // Insert the new feedback if it doesn't exist
    const [insertResults] = await connection.execute(insertFeedbackQuery, [jntuno, message, currentTime, currentDate]);

    if (insertResults.affectedRows === 0) {
      return res.status(500).send('Failed to insert feedback');
    }
    res.json({ success: true, message: 'Feedback submitted successfully' });

  } catch (error) {
    console.error('An error occurred while processing feedback:', error);
    res.status(500).send('An error occurred');
  }
});

Router.get("/sendotp/:email", async (req, res) => {
  const { email } = req.params;
  console.log(email);

  try {
    // Check if the user exists with the provided email
    const queryCheckUser = 'SELECT * FROM students WHERE email = ?';
    const [user] = await connection.execute(queryCheckUser, [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate a new OTP
    const otp = generateOTP();

    // Store the OTP in the database temporarily
    const queryUpdateOTP = 'UPDATE students SET reset_otp = ? WHERE email = ?';
    await connection.execute(queryUpdateOTP, [otp, email]);

    // Configure mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password OTP',
      text: `OTP for Resetting Your Password:\n${otp}`
    };

    // Send the email with OTP
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      } else {
        console.log('Email sent:', info.response);
        return res.json({ message: "OTP sent successfully" });
      }
    });

  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
});

Router.post("/verifyotp", async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    // Check if the user exists with the provided email
    const queryCheckUser = 'SELECT * FROM students WHERE email = ?';
    const [user] = await connection.execute(queryCheckUser, [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the stored reset OTP matches the provided OTP
    if (user[0].reset_otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password with the hashed password and clear the resetOTP field
    const queryUpdatePassword = 'UPDATE students SET spassword = ?, reset_otp = NULL WHERE email = ?';
    await connection.execute(queryUpdatePassword, [hashedPassword, email]);

    return res.json({ message: "OTP verified successfully and Password Updated Successfully" });

  } catch (err) {
    console.error("Error verifying OTP and updating password:", err);
    return res.status(500).json({ message: "Failed to verify OTP and update password" });
  }
});



export default Router;






