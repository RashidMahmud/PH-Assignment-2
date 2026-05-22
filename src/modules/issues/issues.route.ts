
import { USER_ROLE } from "./../../types/index";
import { auth } from "./../../middleware/auth";
import { Router } from "express";
import { issuesController } from "./issues.controller";

const router = Router();
router.post(
  "/",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issuesController.createIssues,
);
router.get("/", issuesController.getIssuesAll);
export const issuesRoute = router;