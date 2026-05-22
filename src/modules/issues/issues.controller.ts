import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import { sendResponse } from "../../utils/sendresponse";

const createIssues = async (req: Request, res: Response) => {
  const { user } = req;
  const id = user?.id;
  const result = await issuesService.createIssuesIntoDB(req.body, id);
  sendResponse(res, 201, {
    message: "Issue created successfully",
    data: result.rows[0],
  });
}
  const getIssuesAll = async (req: Request, res: Response) => {
  console.log(req.query)
  const result = await issuesService.getIssuesFromDB(req.query);
  sendResponse(res, 200, {
    message:"Iusses Retrived Successfully",
    data: result
  });
};
export const issuesController = {
  createIssues,
  getIssuesAll,
}
