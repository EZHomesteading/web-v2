import prisma from "@/lib/prismadb";
interface IParams {
  reviewedId: string;
}

export default async function getSellerReviews(params: IParams) {
  const { reviewedId } = params;
  if (reviewedId) {
    try {
      const reviews = await prisma.reviews.findMany({
        where: {
          reviewedId: reviewedId,
          buyer: true,
        },
      });

      if (!reviews) {
        return null;
      }
      return reviews;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
