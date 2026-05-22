import { pool } from "../../db";

const createIssuesIntoDB = async (
  payload: {
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
const getIssuesFromDB = async (queryParams: { sort?: string; type?: string; status?: string }) => {
  
  const { sort = 'newest', type, status } = queryParams;
  
  let queryText = `SELECT * FROM issues WHERE 1=1`;
  const values: any[] = [];
  let paramIndex = 1;

  if (type) {
    queryText += ` AND type = $${paramIndex}`;
    values.push(type);
    paramIndex++;
  }
  if (status) {
    queryText += ` AND status = $${paramIndex}`;
    values.push(status);
    paramIndex++;
  }

  queryText += sort === 'oldest' ? ` ORDER BY created_at ASC` : ` ORDER BY created_at DESC`;

  const result = await pool.query(queryText, values);
  const issues = result.rows;

  if (issues.length === 0) return [];

  const reporterIds = Array.from(new Set(issues.map(issue => issue.reporter_id)));
  
  const reportersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`, 
    [reporterIds]
  );
  
  const reporterMap = reportersResult.rows.reduce((acc: any, reporter: any) => {
    acc[reporter.id] = reporter;
    return acc;
  }, {});

  return issues.map(issue => {
    const { reporter_id, ...issueData } = issue;
    return {
      ...issueData,
      reporter: reporterMap[reporter_id] || null
    };
  });
};
export const issuesService = {
  createIssuesIntoDB,
  getIssuesFromDB,
};
