import express from 'express';
import connection from '../db.js';
const Router = express();

async function generateAdmissionNumber(branch) {
  const year = new Date().getFullYear();
  const branchCode = branch.toUpperCase();
  const prefix = `ADM-${branchCode}-${year}`;

  const [rows] = await connection.query(
    `SELECT AdmissionNumber FROM StudentInfo WHERE AdmissionNumber LIKE ? ORDER BY Stdid DESC LIMIT 1`,
    [`${prefix}%`]
  );

  let number = '0001';
  if (rows.length > 0) {
    const lastNumber = rows[0].AdmissionNumber.split('-').pop();
    number = (parseInt(lastNumber) + 1).toString().padStart(4, '0');
  }

  return `${prefix}-${number}`;
}



export default Router;