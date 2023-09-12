import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initAuth } from "./authenticator";
import { initLogin } from "./loginHandler";
import { initSession } from "./sessionInitializer";
import runMigrations from "./migrationRunner";

const app: Express = express();
const port = process.env.PORT || 8080;

runMigrations();

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json({ limit: "5000kb" }));
initSession(app);
initAuth(app);
initLogin(app);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/behindlogin", (req: Request, res: Response) => {
  res.send("Dummy page behind login");
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.send('{"a": 1}');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
