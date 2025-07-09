import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

/* ROUTE IMPORTS */
import authRoutes from "./routes/auth/authRoute";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const isProduction = process.env.NODE_ENV === "production";

// if (isProduction) {
//   // TODO: Configure DynamoDB
// }

/* ROUTES */
app.use("/api/auth", authRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 3001;
if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
