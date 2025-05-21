"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PaystackPop from "@paystack/inline-js";

interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  reference: string;
  callback: () => void;
}
import { Button } from "@/components/ui/button";

export default function PaystackPayment({
  email,
  amount,
  orderId,
}: {
  email: string;
  amount: number; // Amount in Kobo
  orderId: string;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount, orderId }),
      });

      const data = await res.json();

      if (!data.success) {
        toast({ description: data.message, variant: "destructive" });
        return;
      }

      const popup = new PaystackPop();
      popup.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email,
        amount,
        reference: orderId,
        callback: () => {
          window.location.href = `/order/${orderId}/paystack-payment-success`;
        },
      } as PaystackOptions);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to initialize payment";
      toast({ description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handlePay} disabled={isLoading}>
      {isLoading ? "Initializing..." : "Pay with Paystack"}
    </Button>
  );
}
