import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { entryRouter } from "./entry.routes";
 
// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();
 
const { ATLAS_URI } = process.env;
 
if (!ATLAS_URI) {
   console.error("No ATLAS_URI environment variable has been defined in config.env");
   process.exit(1);
}
 
// Start the server
connectToDatabase(ATLAS_URI)
   .then(() => {
       const app = express();
       app.use(cors());
       // register the API at the /entrys endpoint
       app.use("/entrys", entryRouter);

       // start the Express server
       app.listen(5200, () => {
           console.log(`Server running at http://localhost:5200 ...`);
       });
 
   })
   .catch(error => console.error(error));