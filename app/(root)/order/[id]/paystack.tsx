"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function PaystackPayment({
  email,
  amount,
  orderId,
}: {
  email: string;
  amount: number;
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

      if (!data.success || !data.authorization_url) {
        toast({
          description: data.message || "Paystack init failed",
          variant: "destructive",
        });
        return;
      }

      window.location.href = data.authorization_url;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong with Paystack";
      toast({ description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handlePay} disabled={isLoading}>
      {isLoading ? "Redirecting..." : "Pay with Paystack"}
    </Button>
  );
}
