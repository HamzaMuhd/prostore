"use client";

import { CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";

const AddtoCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
      return;
    }
    toast({
      description: res.message,
      action: (
        <ToastAction
          className="bg-primary text-white hover:bg-gray-800"
          altText="Go To Cart"
          onClick={() => router.push("/cart")}
        >
          Go To Cart
        </ToastAction>
      ),
    });
  };

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  );
};

export default AddtoCart;
