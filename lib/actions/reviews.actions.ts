"use server";

import { z } from "zod";
import { insertReviewSchema } from "../validator";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

// Create & update Reviews

export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    // Validate and store the review
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user?.id,
    });

    const product = await prisma.product.findFirst({
      where: {
        id: review.productId,
      },
    });
    if (!product) throw new Error("Product not found");

    // Check if user already reviewed
    const reviewExists = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (reviewExists) {
        await tx.review.update({
          where: { id: reviewExists.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        await tx.review.create({ data: review });
      }
      // Get the average rating
      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: {
          productId: review.productId,
        },
      });

      // Get number of reviews
      const numReviews = await tx.review.count({
        where: {
          productId: review.productId,
        },
      });

      // Update the rating and numReviews in product table
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews,
        },
      });
    });
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Review Updated Successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all reviews for a product
export async function getReview({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: { productId: productId },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { data };
}

// Get a review written by the current user
export async function getReviewByProductId({
  productId,
}: {
  productId: string;
}) {
  const session = await auth();
  if (!session) throw new Error("User is not authenticated");

  return await prisma.review.findFirst({
    where: { productId, userId: session?.user?.id },
  });
}
