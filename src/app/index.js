import path from "path";
import express from "express";
import cors from "cors";
import router from "./routes.js";
import { errorHandler } from "../middleware/error.js";
import { fileURLToPath } from "url";
import config from "../config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const uploadPath = path.join(__dirname, "../../uploads");

const allowedOrigin = ["http://localhost:4000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigin.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(config.STATIC_PATH, express.static(uploadPath));
app.use("/api", router);
app.use(errorHandler);

export default app;
