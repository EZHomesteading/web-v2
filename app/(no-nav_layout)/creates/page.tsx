import { getUserLocations } from "@/actions/getLocations";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

const CreatesPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const session = await auth();
  if (!session) {
    window.location.replace("/");
  }
  let locations = await getUserLocations({ userId: session?.user?.id });

  locations = locations?.filter((loc) => loc.role !== UserRole.CONSUMER); // i hate javascript

  const defaultLocation = locations?.find(
    (loc) => loc?.id === searchParams?.id && loc.role !== UserRole.CONSUMER
  );

  return (
    <div className="relative min-h-screen bg-blue-600">
      <Header />

      <div className="absolute top-20 bottom-20 left-0 right-0">
        <div className="h-full flex flex-col justify-end">
          <div className="w-full overflow-y-auto">
            {/* {items.map((item) => (
              <div
                key={item}
                className="w-full p-4 bg-orange-500 border-t border-white"
              >
                Content Item {item}
              </div>
            ))} */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const Header = () => {
  return <div className="fixed top-0 left-0 right-0 h-20 bg-green-500 z-10" />;
};

const Footer = () => {
  return <div className="fixed bottom-0 left-0 right-0 h-20 bg-red-500 z-10" />;
};

export default CreatesPage;
