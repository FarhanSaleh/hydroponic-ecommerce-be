import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();

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
app.use("/api", router);

export default app;
