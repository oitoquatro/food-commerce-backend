import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { SnackData } from "./interfaces/SnackData";
import { CustomerData } from "./interfaces/CustomerData";
import { PaymentData } from "./interfaces/PaymentData";
import CheckoutService from "./services/CheckoutService";

dotenv.config();

const app: Express = express(); //o express é tipo um mini servidor.
const port = process.env.PORT || 5000; //config. da porta.
const prisma = new PrismaClient(); //iniciando

app.use(express.json()); //config. o express para o tipo json.

app.get("/", (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) return res.status(400).send({ error: "Message is required" });

  res.send({ message });
});

app.get("/snacks", async (req: Request, res: Response) => {
  const { snack } = req.query;
  //se não tiver o snack , lance esta mensagem de erro.
  if (!snack) return res.status(400).send({ error: "Snack is required" });
  //se tiver o snack faça essa chamanda de snack que esta no parametro "{}".
  //SELECT * FROM Snack WHERE snack = 'drink'   ( no caso drink = snack as string )
  const snacks = await prisma.snack.findMany({
    where: {
      snack: {
        equals: snack as string,
      },
    },
  });
  res.send(snacks);
  //para testar (Insomnia) environment  { "api_url": "http://localhost:5000 } no navegador do insomnia api_url/snacks.
  //rodar o servidor na porta 5000 no terminal npm run dev.
  //Send no insomnia
});

app.get("/orders/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    //findUnique retorna apenas um valor.
    where: {
      id: +id, //converte o id para numero, como se fosse parseInt
    },
    include: { customer: true, orderItens: { include: { snack: true } } },
  });

  if (!order) return res.status(404).send({ error: "Order not found" });
  res.send(order);
});

interface CheckoutRequest extends Request {
  body: {
    cart: SnackData[];
    customer: CustomerData;
    payment: PaymentData;
  };
}

app.post("/checkout", async (req: CheckoutRequest, res: Response) => {
  const { cart, customer, payment } = req.body;

  const orderCreated = await new CheckoutService().process(
    cart,
    customer,
    payment
  );

  res.send(orderCreated);
});

app.listen(port, () => {
  //mostrando para o express em qual porta o projeto está.
  console.log(`Server running on port ${port}`);
});
