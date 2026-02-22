import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";

const app:Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get('/',async (req: Request, res: Response) => {
  const speciality = await prisma.speciality.create({
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

export default app;