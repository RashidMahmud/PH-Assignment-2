import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import { sendResponse } from "../../utils/sendresponse";

const createIssues = async (req: Request, res: Response) => {
  // const result = await issuesService.createIssuesIntoDB(req.body)
  const { user } = req;
  const id = user?.id;
  const result = await issuesService.createIssuesIntoDB(req.body, id);
  sendResponse(res, 201, {
    message: "Issue created successfully",
    data: result.rows[0],
  });
};
export const issuesController = {
  createIssues,
};
