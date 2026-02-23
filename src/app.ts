import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
   
const app:Application = express();
 // Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));



// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api/v1", IndexRoutes)
// Basic route
app.get('/',async (req: Request, res: Response) => {
  const speciality = await prisma.specialty.create({
    data:{
      title:"this is trm health care title"
    }
  })
  res.status(201).json({
    success:true,
    message:"api is working",
    data:speciality
  });
});


// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(globalErrorHandler as any);

export default app;