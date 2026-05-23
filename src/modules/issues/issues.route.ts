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
router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssues);
router.patch(
  "/:id",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issuesController.updateIssue,
);
router.delete(
  "/:id",
  auth(USER_ROLE.maintainer),
  issuesController.deleteIssues,
);
export const issuesRoute = router;
