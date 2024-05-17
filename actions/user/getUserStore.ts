import prisma from "@/lib/prismadb";

interface Params {
  userId?: string;
}

export default async function getUserStore(params: Params) {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        image: true,
        bio: true,
        createdAt: true,
        role: true,
        listings: {
          select: {
            imageSrc: true,
            title: true,
            price: true,
            id: true,
            quantityType: true,
            location: {
              select: {
                address: true,
              },
            },
          },
        },
        sellerReviews: {
          select: {
            id: true,
            review: true,
            rating: true,
            buyer: {
              select: {
                id: true,
                name: true,
                firstName: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return null;
    }
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}
