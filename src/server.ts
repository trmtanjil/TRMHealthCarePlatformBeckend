import app from "./app";
import { envVars } from "./app/config/env";

 
const port = envVars.PORT; // The port your express server will be running on.



const bootstrap = async () => {
  try {
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
 } catch (error) {
   console.error("Error starting the server:", error);
 }
  }

bootstrap();