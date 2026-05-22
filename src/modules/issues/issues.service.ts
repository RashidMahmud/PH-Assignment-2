import { pool } from "../../db";
import type { 
  IIssuePayload, 
  IIssueQueryParams, 
  IReporterMap, 
  IIssueRow,
  IReporter, } from "./issues.interface";

const createIssuesIntoDB = async (
  payload: IIssuePayload,
  reporterId: number,
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
  const getAllIssuesFromDB = async (queryParams: IIssueQueryParams) => {
  const { sort = "newest", type, status } = queryParams;
  
  let queryText = `SELECT * FROM issues WHERE 1=1`;
  const values: (string | number)[] = [];
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

  const reporterIds = Array.from(
    new Set(issues.map((issue) => issue.reporter_id)),
  );
  
  const reportersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporterIds],
  );
  
  const reporterMap = reportersResult.rows.reduce<IReporterMap>(
    (acc, reporter) => {
      acc[reporter.id] = reporter;
      return acc;
    },
    {},
  );

  return issues.map(issue => {
    const { reporter_id, ...issueData } = issue;
    return {
      ...issueData,
      reporter: reporterMap[reporter_id] || null,
    };
  });
};
  const getSingleIssuesFromDB = async (id: string) => {
  const issueResult = await pool.query<IIssueRow>(
    `SELECT * FROM issues WHERE id = $1`,
    [id],
  );

  if (issueResult.rows.length === 0) {
    return null;
  }

  const issue = issueResult.rows[0] as IIssueRow;

  const reporterResult = await pool.query<IReporter>(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id],
  );

  const reporter = reporterResult.rows[0] || null;

  const { reporter_id, ...issueData } = issue;

  return {
    ...issueData,
    reporter: reporter,
  };
};
export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
  getSingleIssuesFromDB,
};
