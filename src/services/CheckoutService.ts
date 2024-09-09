import { PrismaClient } from "@prisma/client";
import { CustomerData } from "../interfaces/CustomerData";
import { PaymentData } from "../interfaces/PaymentData";
import { SnackData } from "../interfaces/SnackData";

export default class CheckoutService {
  private prisma: PrismaClient;

  // new CheckoutService()
  constructor() {
    this.prisma = new PrismaClient();
  }

  async process(
    cart: SnackData[],
    customer: CustomerData,
    payment: PaymentData
  ) {
    // TODO: "puxar" os dados de snacks do BD
    // O findMany() vai buscar onde (where) o id estiver em (in) cart.map...
    const snacks = await this.prisma.snack.findMany({
      where: {
        id: {
          in: cart.map((snack) => snack.id),
        },
      },
    });
    console.log(`snacks`, snacks)
    // TODO: "registrar" os dados do cliente no BD
    // TODO: criar uma order
    // TODO: processar o pagamento
  }
}
