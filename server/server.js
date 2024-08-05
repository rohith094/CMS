import express from "express";
import StudentRoutes from './Routes/studentroutes.js';
import AdminRoutes from './Routes/adminRoutes.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())

app.use("/student", StudentRoutes);
app.use("/admin", AdminRoutes);

app.listen(3001, () => {
  console.log("Server Connected");
})



