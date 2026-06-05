

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_express3 = __toESM(require("express"), 1);

// src/config/index.ts
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config({
  path: import_path.default.join(process.cwd(), ".env")
});
var config = {
  connection_string: process.env.CONNECTIONSTRING,
  port: parseInt(process.env.PORT || "5432", 10),
  secret: process.env.JWT_SECRET,
  refresh_secret: process.env.JWT_REFRESH_SECRET,
  node_env: process.env.NODE_ENV || "development",
  access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "7d",
  refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "30d"
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
var import_express = require("express");

// src/utils/sendResponse.ts
function sendResponse(res, status = 200, { message, data, error }) {
  res.status(status).json({
    success: error ? false : true,
    message,
    data: error ? void 0 : data
  });
}

// src/modules/auth/auth.service.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);

// src/db/index.ts
var import_pg = require("pg");

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
var pool = new import_pg.Pool({
  connectionString: config_default.connection_string
});
var initDB = async () => {
  try {
    await createScheme();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

// src/modules/auth/auth.service.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var signUpIntoDB = async (payload) => {
  const { name, email, password, role } = payload;
  const hashPassword = await import_bcryptjs.default.hash(password, 10);
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
  const matchPassword = await import_bcryptjs.default.compare(String(password), user.password);
  if (!matchPassword) {
    throw new Error("Invalid Credentials and password dontchange");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = await import_jsonwebtoken.default.sign(jwtPayload, config_default.secret, {
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
var router = (0, import_express.Router)();
router.post("/signup", authController.userSignup);
router.post("/login", authController.userLogin);
var userRoute = router;

// src/types/index.ts
var USER_ROLE = {
  contributor: "contributor",
  maintainer: "maintainer"
};

// src/middleware/auth.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
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
      const decoded = import_jsonwebtoken2.default.verify(
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
var import_express2 = require("express");

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
var router2 = (0, import_express2.Router)();
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
var app = (0, import_express3.default)();
app.use(import_express3.default.json());
app.get("/", (req, res) => {
  res.status(200).json({
    message: "DevPulse Server Running",
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
    console.log(`Server is running on ${config_default.port}`);
  });
};
main();
//# sourceMappingURL=server.cjs.map