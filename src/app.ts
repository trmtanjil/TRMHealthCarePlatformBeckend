import express, { Application, Request, Response } from "express";
 import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cors from "cors";
import AppError from "./app/errorHelpers/AppError";
import status from "http-status";
   
const app:Application = express();

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

app.use("/api/v1", IndexRoutes)
// Basic route
app.get('/',async (req: Request, res: Response) => {
 
throw new AppError(status.BAD_REQUEST, "just tasting error handle ")


  res.status(201).json({
    success:true,
    message:"api is working",
    
  });
});


app.use(globalErrorHandler);
app.use(notFound)

export default app;