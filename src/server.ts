import app from "./app";

 
const port = process.env.PORT || 5000; // The port your express server will be running on.



const bootstrap = async () => {
  try {
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(process.env.DATABASE_URL)
   });
 } catch (error) {
   console.error("Error starting the server:", error);
 }
  }

bootstrap();