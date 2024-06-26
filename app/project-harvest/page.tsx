import Link from "next/link";
import { Button } from "../components/ui/button";

const Page = () => {
  return (
    <div className="bg h-screen flex flex-col gap-2 justify-center items-center">
      In Progress
      <Link href="/dashboard">
        <Button>Go Back to Dashbaord</Button>
      </Link>
    </div>
  );
};

export default Page;
