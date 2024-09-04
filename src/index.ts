import exp from "constants";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

dotenv.config();

const app: Express = express(); //o express é tipo um mini servidor.
const port = process.env.PORT || 5000; //config. da porta.

app.use(express.json()); //config. o express para o tipo json.

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!!!!!");
});

app.listen(port, () => {   //mostrando para o express em qual porta o projeto está.
  console.log(`Server running on port ${port}`);
});
