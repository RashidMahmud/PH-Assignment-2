

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express from "express";

// src/config/index.ts
import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  connection_string: process.env.CONNECTIONSTRING,
  port: process.env.PORT,
  secret: process.env.JWT_SECRET,
  refresh_secret: process.env.JWT_REFRESH_SECRET,
  node_env: process.env.NODE_ENV,
  access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
  refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN
};
var config_default = config;

// src/middleware/globelErrrHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err instanceof Error ? err.message : "Internal Server Error",
    stack: config_default.node_env === "development" && err instanceof Error ? err.stack : void 0
  });
};
var globelErrrHandler_default = globalErrorHandler;

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/utils/sendResponse.ts
function sendResponse(res, status = 200, { message, data, error }) {
  res.status(status).json({
    success: error ? false : true,
    message,
    data: error ? void 0 : data
  });
}

// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";

// src/db/index.ts
import { Pool } from "pg";

// src/db/schema.ts
var createScheme = async () => {
  await pool.query(`

    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL, 
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'contributor' NOT NULL 
            CHECK (role IN ('contributor', 'maintainer')), 
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
`);
  await pool.query(`
  CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(20) NOT NULL 
          CHECK (type IN ('bug', 'feature_request')),
      status VARCHAR(20) DEFAULT 'open' NOT NULL 
          CHECK (status IN ('open', 'in_progress', 'resolved')),
      reporter_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
`);
};

// src/db/index.ts
var pool = new Pool({
  connectionString: config_default.connection_string
});
var initDB = async () => {
  await createScheme();
  console.log("Database connected successfully!");
};

// src/modules/auth/auth.service.ts
import jwt from "jsonwebtoken";
var signUpIntoDB = async (payload) => {
  const { name, email, password, role } = payload;
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
         INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING id, name, email, role, created_at, updated_at
        `,
    [name, email, hashPassword, role]
  );
  return result;
};
var loginIntoDB = async (payload) => {
  const { email, password } = payload;
  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email
  ]);
  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials!");
  }
  const user = userData.rows[0];
  const matchPassword = await bcrypt.compare(String(password), user.password);
  if (!matchPassword) {
    throw new Error("Invalid Credentials and password dontchange");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = await jwt.sign(jwtPayload, config_default.secret, {
    expiresIn: config_default.access_expires_in
  });
  const { password: _, ...userWithoutPassword } = user;
  return { accessToken, userWithoutPassword };
};
var authService = {
  signUpIntoDB,
  loginIntoDB
};

// src/modules/auth/auth.controller.ts
var userSignup = async (req, res) => {
  const result = await authService.signUpIntoDB(req.body);
  sendResponse(res, 201, {
    message: "User registered successfully",
    data: result.rows[0]
  });
};
var userLogin = async (req, res) => {
  const result = await authService.loginIntoDB(req.body);
  sendResponse(res, 200, {
    message: "Login successful",
    data: {
      token: result.accessToken,
      user: result.userWithoutPassword
    }
  });
};
var authController = {
  userSignup,
  userLogin
};

// src/modules/auth/auth.route.ts
var router = Router();
router.post("/signup", authController.userSignup);
router.post("/login", authController.userLogin);
var userRoute = router;

// src/types/index.ts
var USER_ROLE = {
  contributor: "contributor",
  maintainer: "maintainer"
};

// src/middleware/auth.ts
import jwt2 from "jsonwebtoken";
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Access denied. No token provided"
        });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt2.verify(
        token,
        config_default.secret
      );
      const userData = await pool.query(
        `SELECT id, name, email, role FROM users WHERE email = $1`,
        [decoded.email]
      );
      const user = userData.rows[0];
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User account not found."
        });
      }
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized. You do not have permission to access this resource."
        });
      }
      req.user = decoded;
      next();
    } catch (error) {
      return next(error);
    }
  };
};

// src/modules/issues/issues.route.ts
import { Router as Router2 } from "express";

// src/modules/issues/issues.service.ts
var createIssuesIntoDB = async (payload, reporterId) => {
  const { title, description, type } = payload;
  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
    [title, description, type, reporterId]
  );
  return result;
};
var getAllIssuesFromDB = async (queryParams) => {
  const { sort = "newest", type, status } = queryParams;
  let queryText = `SELECT * FROM issues WHERE 1=1`;
  const values = [];
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
  queryText += sort === "oldest" ? ` ORDER BY created_at ASC` : ` ORDER BY created_at DESC`;
  const result = await pool.query(queryText, values);
  const issues = result.rows;
  if (issues.length === 0) return [];
  const reporterIds = Array.from(
    new Set(issues.map((issue) => issue.reporter_id))
  );
  const reportersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporterIds]
  );
  const reporterMap = reportersResult.rows.reduce(
    (acc, reporter) => {
      acc[reporter.id] = reporter;
      return acc;
    },
    {}
  );
  return issues.map((issue) => {
    const { reporter_id, ...issueData } = issue;
    return {
      ...issueData,
      reporter: reporterMap[reporter_id] || null
    };
  });
};
var getSingleIssuesFromDB = async (id) => {
  const issueResult = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id]
  );
  if (issueResult.rows.length === 0) {
    return null;
  }
  const issue = issueResult.rows[0];
  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id]
  );
  const reporter = reporterResult.rows[0] || null;
  const { reporter_id, ...issueData } = issue;
  return {
    ...issueData,
    reporter
  };
};
var updateIssuesFromDB = async (issueId, payload, user) => {
  const existingIssue = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    issueId
  ]);
  const issue = existingIssue.rows[0];
  if (!issue) {
    throw new Error("Issue not found");
  }
  if (user.role === "contributor") {
    if (issue.reporter_id !== user.id) {
      throw new Error("You are not authorized");
    }
    if (issue.status !== "open") {
      throw new Error("You can only update issue when status is open");
    }
  }
  delete payload.id;
  delete payload.created_at;
  delete payload.updated_at;
  delete payload.reporter_id;
  if (payload.title && payload.title.length > 150) {
    throw new Error("Title cannot exceed 150 characters");
  }
  if (payload.description && payload.description.length < 20) {
    throw new Error("Description must be at least 20 characters");
  }
  if (payload.type && !["bug", "feature_request"].includes(payload.type)) {
    throw new Error("Invalid issue type");
  }
  if (payload.status && !["open", "in_progress", "resolved"].includes(payload.status)) {
    throw new Error("Invalid status");
  }
  const fields = Object.keys(payload);
  if (fields.length === 0) {
    throw new Error("No update data provided");
  }
  const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
  const values = [
    ...fields.map((field) => payload[field]),
    issueId
  ];
  const query = `
    UPDATE issues
    SET ${setClause}
    WHERE id = $${fields.length + 1}
    RETURNING *;
  `;
  const result = await pool.query(query, values);
  return result.rows[0];
};
var deleteIssueFromDB = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM issues WHERE id=$1  
      `,
    [id]
  );
  return result;
};
var issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
  getSingleIssuesFromDB,
  updateIssuesFromDB,
  deleteIssueFromDB
};

// src/modules/issues/issues.controller.ts
var createIssues = async (req, res) => {
  const { user } = req;
  const id = user?.id;
  const result = await issuesService.createIssuesIntoDB(req.body, id);
  sendResponse(res, 201, {
    message: "Issue created successfully",
    data: result.rows[0]
  });
};
var getAllIssues = async (req, res) => {
  console.log(req.query);
  const result = await issuesService.getAllIssuesFromDB(req.query);
  sendResponse(res, 200, {
    message: "Iusses Retrived Successfully",
    data: result
  });
};
var getSingleIssues = async (req, res) => {
  const { id } = req.params;
  const result = await issuesService.getSingleIssuesFromDB(id);
  sendResponse(res, 200, {
    data: result
  });
};
var updateIssue = async (req, res) => {
  const { id } = req.params;
  const updatebody = req.body;
  if (!req.user) {
    throw new Error("Authentication required to update issues");
  }
  const result = await issuesService.updateIssuesFromDB(
    id,
    updatebody,
    req.user
  );
  sendResponse(res, 200, {
    message: "Issue updated successfully",
    data: result
  });
};
var deleteIssues = async (req, res) => {
  const { id } = req.params;
  await issuesService.deleteIssueFromDB(id);
  sendResponse(res, 200, {
    message: "Issue deleted successfully"
  });
};
var issuesController = {
  createIssues,
  getAllIssues,
  getSingleIssues,
  updateIssue,
  deleteIssues
};

// src/modules/issues/issues.route.ts
var router2 = Router2();
router2.post(
  "/",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issuesController.createIssues
);
router2.get("/", issuesController.getAllIssues);
router2.get("/:id", issuesController.getSingleIssues);
router2.patch(
  "/:id",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issuesController.updateIssue
);
router2.delete(
  "/:id",
  auth(USER_ROLE.maintainer),
  issuesController.deleteIssues
);
var issuesRoute = router2;

// src/app.ts
var app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({
    message: "DevPulse Server Runing",
    author: "Rashid Mahmud"
  });
});
app.use("/api/auth", userRoute);
app.use("/api/issues", issuesRoute);
app.use(globelErrrHandler_default);
var app_default = app;

// src/server.ts
var main = () => {
  initDB();
  app_default.listen(config_default.port, () => {
    console.log(`App listening on port ${config_default.port}`);
  });
};
main();
//# sourceMappingURL=server.js.map