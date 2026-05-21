import { pool } from "../../db"

const createIssuesIntoDB=async(payload:any)=>{
  const{title,description,type}=payload
  const result= await pool.query(
    `
    INSERT INTO 
    `
  )
  
}
export const issuesService={
    createIssuesIntoDB,
}