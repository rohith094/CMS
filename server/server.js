import express from "express";
import StudentRoutes from './Routes/studentroutes.js';
import AdminRoutes from './Routes/adminRoutes.js';
import FacultyRoutes from './Routes/FacultyRoutes.js';
import StudentInfo from './Routes/studentinfo.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())

app.use("/student", StudentRoutes);
app.use("/studentinfo", StudentInfo);
// app.use("/faculty", FacultyRoutes);
app.use("/faculty", FacultyRoutes);
app.use("/admin", AdminRoutes);

app.listen(3001, () => {
  console.log("Server Connected"); 
})



