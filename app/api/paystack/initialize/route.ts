import { SERVER_URL } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, amount, orderId } = await req.json();

  if (!email || !amount || !orderId) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }
  const reference = `${orderId}-${Date.now()}`;
  const amountInKobo = Math.round(amount);

  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        reference,
        callback_url: `${SERVER_URL}/order/${orderId}/paystack-payment-success`,
        metadata: { orderId },
      }),
    }
  );
  const data = await response.json();

  if (!data.status) {
    return NextResponse.json(
      { success: false, message: data.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    access_code: data.data.access_code,
    reference,
  });
}
