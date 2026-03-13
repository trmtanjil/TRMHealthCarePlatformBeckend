/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from "express";
 import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import { envVars } from "./app/config/env";
 import qs from "qs"
import { paymentController } from "./app/module/payment/payment.controller";
import cron from "node-cron";
import { AppointmentService } from "./app/module/appointment/appointment.service";

const app:Application = express();
  app.set("query parser",(str:string) =>qs.parse(str))

  app.use("/webhook", express.raw({type:"application/json"}),paymentController.handleStripewebhookEvent)

app.use(cors({
  origin : [ envVars.FRONTEND_URL,envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
  credentials : true,
  methods : ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders : ["Content-Type", "Authorization"]
}))


app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`))
app.use("api/auth",toNodeHandler(auth))


app.use("/api/auth", toNodeHandler(auth))
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));




// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

cron.schedule("*/30 * * * *",async () => {
  try {
    console.log("Running cron job to cencel unpaid appoinments....")
  await AppointmentService.cancelUnpaidAppointments();
  } catch (error:any) {
    console.error("Error in cron job:", error);
  }
});

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