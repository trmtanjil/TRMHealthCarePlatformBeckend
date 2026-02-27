import express, { Application, Request, Response } from "express";
 import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
 
   
const app:Application = express();
app.use("api/auth",toNodeHandler(auth))

app.use(cors({
  origin : [  "http://localhost:3000", "http://localhost:5000"],
  credentials : true,
  methods : ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders : ["Content-Type", "Authorization"]
}))

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));



// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())

app.use("/api/v1", IndexRoutes)
// Basic route
app.get('/',async (req: Request, res: Response) => {
 

  res.status(201).json({
    success:true,
    message:"api is working",
    
  });
});


app.use(globalErrorHandler);
app.use(notFound)

export default app;