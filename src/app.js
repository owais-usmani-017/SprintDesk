import express from "express";
import cors from "cors"
import Dotenv from "dotenv";
const app = express();

//basic configurations
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

//cors configs
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

//import routes

import healthCheckRouter from "./routes/healthcheck.routes.js";

app.use("/api/v1/healthcheck" , healthCheckRouter)

app.get("/" , (req,res)=>{
    res.send("welcome to SprintDesk")
})

export default app;