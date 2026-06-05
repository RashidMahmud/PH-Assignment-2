🚀 **DevPulse** is a modern, enterprise-ready collaboration backend built to help software development teams efficiently manage bugs, feature requests, system requirements, and project workflows. It provides a smooth and organized environment for tracking development progress, resolving issues, and maintaining team productivity. 💻⚡

## 🌐 Live Links

🔗 **Backend API Live:** [https://express-postgres-2s9epsdei-rashidmahmuds-projects.vercel.app/](https://express-postgres-2s9epsdei-rashidmahmuds-projects.vercel.app/)
📂 **GitHub Repository:** [https://github.com/RashidMahmud/PH-Assignment-2](https://github.com/RashidMahmud/PH-Assignment-2)

## ✨ Key Features

🔐 **Role-Based Access Control**
DevPulse includes a smart permission system where contributors can create and manage their own tasks, while maintainers have full administrative control including deletions, updates, and monitoring overall project statistics.

⚡ **Optimized No-JOIN Database Architecture**
The backend is designed using an advanced no-JOIN strategy, handling relational operations through in-memory processing. This improves performance, reduces database overhead, and supports better scalability. 📈

🛡️ **Strong Security System**
User passwords are securely encrypted using bcrypt hashing, while protected routes are secured through JSON Web Token (JWT) authentication for safe and reliable access control. 🔑

## 🛠️ Tech Stack

⚙️ **Runtime Environment:** Node.js (v24.x LTS)
📘 **Language:** TypeScript
🌐 **Framework:** Express.js
🗄️ **Database:** PostgreSQL using native pg pool configuration with Raw SQL queries only

## 📚 API Overview

### 🔑 Authentication Routes

* `POST /api/auth/signup` → Register a new user *(Public)*
* `POST /api/auth/login` → Login and receive JWT token *(Public)*

### 🐞 Issues Management Routes

* `POST /api/issues` → Create a new bug report or feature request *(Authenticated)*
* `GET /api/issues` → Retrieve all issues with filtering and sorting options *(Public)*
* `GET /api/issues/:id` → Get detailed information about a specific issue *(Public)*
* `PATCH /api/issues/:id` → Update issue details or status *(Owner / Maintainer)*
* `DELETE /api/issues/:id` → Remove an issue permanently *(Maintainer Only)*

💡 DevPulse is built to deliver a fast, secure, and scalable backend experience for modern development teams and collaborative engineering environments.
