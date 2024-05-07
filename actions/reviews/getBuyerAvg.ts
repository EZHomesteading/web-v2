import prisma from "@/lib/prismadb";
interface IParams {
  reviewedId: string;
}

export default async function getBuyerAvg(params: IParams) {
  const { reviewedId } = params;
  if (reviewedId) {
    try {
      const reviews = await prisma.reviews.findMany({
        where: {
          reviewedId: reviewedId,
          buyer: false,
        },
      });

      if (!reviews) {
        return null;
      }
      const sumOfRatings = reviews.reduce((accumulator, review) => {
        return accumulator + review.rating;
      }, 0);

      const averageRating = sumOfRatings / reviews.length;
      return averageRating;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
