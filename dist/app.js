import express, {} from "express";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Express Server Runing",
        author: "Rashid Mahmud",
    });
});
export default app;
//# sourceMappingURL=app.js.map