import type { Request, Response } from "express";
import { issuesService } from "./issues.service";

const createIssues = async (req: Request, res: Response) => {
    const result = await issuesService.createIssuesIntoDB(req.body)
};
export const issuesController = {
  createIssues,
};