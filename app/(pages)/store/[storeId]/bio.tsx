import Avatar from "@/app/components/Avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { UserInfo } from "@/next-auth";
import { UserRole } from "@prisma/client";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
  style: "normal",
});

interface Props {
  user?: UserInfo;
}

const Bio = ({ user }: Props) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleString("en-US", options);
  };
  return (
    <Sheet>
      <SheetTrigger>
        <Button>More Info</Button>
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col px-2 gap-y-2">
          <div className="flex flex-row items-center">
            <Avatar user={user} />
            <div
              className={`${outfit.className} weight-100 flex flex-col ml-2`}
            >
              <div className="flex flex-col items-start gap-x-2">
                <div className="font-bold text-xl lg:text-2xl">
                  {user?.name}
                </div>
                {user?.createdAt && (
                  <>
                    {user.role === UserRole.COOP ? (
                      <div>
                        EZH Co-op Since {formatDate(user.createdAt.toString())}
                      </div>
                    ) : (
                      <div>
                        EZH Producer Since{" "}
                        {formatDate(user.createdAt.toString())}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <h1>{user?.firstName}&apos; Bio</h1>
          <Card>
            <CardContent className="py-2">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde
              dolores magnam esse maiores reprehenderit minus dolor. At, nemo!
              Voluptatibus adipisci ad quam inventore! Nemo magni velit,
              accusamus nisi numquam non? Excepturi voluptate magnam aliquid
              odit, sunt eaque doloribus nam maiores. Aspernatur deleniti libero
              id eius error, aut ullam inventore consectetur est, veritatis
              quidem reprehenderit illo qui velit, ad eligendi maiores!
            </CardContent>
          </Card>
          <h2>Reviews</h2>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Bio;
