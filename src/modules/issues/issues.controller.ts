import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import { sendResponse } from "../../utils/sendResponse";

const createIssues = async (req: Request, res: Response) => {
  const { user } = req;
  const id = user?.id;
  const result = await issuesService.createIssuesIntoDB(req.body, id as number);
  sendResponse(res, 201, {
    message: "Issue created successfully",
    data: result.rows[0],
  });
}
  const getAllIssues = async (req: Request, res: Response) => {
  console.log(req.query);
  const result = await issuesService.getAllIssuesFromDB(req.query);

  sendResponse(res, 200, {
    message:"Iusses Retrived Successfully",
    data: result,
  });
};
const getSingleIssues = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await issuesService.getSingleIssuesFromDB(id as string);
  sendResponse(res, 200, {
  data: result,
  });
};
  const updateIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatebody = req.body;
  if (!req.user) {
    throw new Error("Authentication required to update issues");
  }

  const result = await issuesService.updateIssuesFromDB(
    id as string,
    updatebody,
    req.user,
  );

  sendResponse(res, 200, {
    message: "Issue updated successfully",
    data: result,
  });
};
  const deleteIssues = async (req: Request, res: Response) => {
  const { id } = req.params;
  await issuesService.deleteIssueFromDB(id as string);
  sendResponse(res, 200, {
    message: "Issue deleted successfully",
  });
};
export const issuesController = {
  createIssues,
  getAllIssues,
  getSingleIssues,
  updateIssue,
  deleteIssues,
}
