import app from "./app";
import { envVars } from "./app/config/env";
import { seedSupperAdmin } from "./app/utils/seed";

 
const port = envVars.PORT; // The port your express server will be running on.



const bootstrap = async () => {
  try {
    await seedSupperAdmin();
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
 } catch (error) {
   console.error("Error starting the server:", error);
 }
  }

bootstrap();