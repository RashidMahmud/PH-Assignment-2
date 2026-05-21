import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import globalErrorHandler from "./middleware/globelErrrHandler";
import { userRoute } from "./modules/auth/auth.route";
const app: Application = express();
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "DevPulse Server Runing",
    author: "Rashid Mahmud",
  });
});
app.use("/api/auth", userRoute);

app.use(globalErrorHandler);
export default app;
