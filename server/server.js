import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { db } from "./integrations/mysql.js";
import router from "./router/main_routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const PORT = process.env.PORT;
const app = express();

//mysql initialization
db();

// akon mga middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`app is running in port ${PORT}`);
});
