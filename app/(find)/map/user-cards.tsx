import Container from "@/app/components/Container";
import ClientOnly from "../../components/client/ClientOnly";
import Link from "next/link";
import UserCard from "@/app/components/listings/user-card";

interface UserCardProps {
  vendors: any;
  emptyState: React.ReactNode;
  totalPages: number;
  isPageOutOfRange: boolean;
  pageNumbers: number[];
  currentPage: number;
  userCoordinates: number[][];
}

const UserCards = ({
  vendors,
  emptyState,
  totalPages,
  isPageOutOfRange,
  pageNumbers,
  currentPage,
  userCoordinates,
}: UserCardProps) => {
  console.log("user coords", userCoordinates);
  return (
    <ClientOnly>
      <Container>
        {emptyState || (
          <div className="pt-5 grid md:grid-cols-1 w-full gap-2">
            {vendors.length === 0 ? (
              emptyState
            ) : (
              <div className="pt-5 grid md:grid-cols-2 w-full gap-2">
                {vendors.map((user: any) => (
                  <UserCard user={user} key={user.id} />
                ))}
              </div>
            )}
          </div>
        )}
        {totalPages > 1 && (
          <>
            {isPageOutOfRange ? (
              <></>
            ) : (
              <div className="flex justify-center items-end mt-16">
                <div className="flex border-[1px] gap-4 rounded-[10px] border-light-green p-4">
                  {pageNumbers.map((pageNumber, index) => (
                    <Link
                      key={index}
                      className={
                        currentPage === pageNumber
                          ? "bg-green-600 fw-bold px-2 rounded-md text-black"
                          : "hover:bg-green-600 px-1 rounded-md"
                      }
                      href={`?page=${pageNumber}`}
                    >
                      {pageNumber}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </ClientOnly>
  );
};

export default UserCards;
