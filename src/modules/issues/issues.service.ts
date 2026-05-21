import { pool } from "../../db"

const createIssuesIntoDB=async(payload: {
  title: string;
    description: string;
    type: "bug" | "feature_request";
  },
  reporterId: string,
) => {
  const { title, description, type } = payload;
  const result = await pool.query(
     `INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
    [title, description, type, reporterId],
  );

  return result;
};
export const issuesService = {
  createIssuesIntoDB,
};
  

