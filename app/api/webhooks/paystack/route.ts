import { NextRequest, NextResponse } from "next/server";
import { updateOrderToPaid } from "@/lib/actions/order.actions";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") as string;

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  if (signature !== hash) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const payment = event.data;

    await updateOrderToPaid({
      orderId: payment.metadata.orderId,
      paymentResult: {
        id: payment.id,
        status: "COMPLETED",
        email_address: payment.customer.email,
        pricePaid: (payment.amount / 100).toFixed(),
      },
    });

    return NextResponse.json({ message: "updateOrderToPaid was successful" });
  }

  return NextResponse.json({ message: "event is not charge.success" });
}
