import { Button } from "@/app/components/ui/button";
import Link from "next/link";

const StoreSettings = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div>Store Settings Page, In Progress</div>
      <div className="flex flex-row gap-x-4">
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
        <Link href="/shop">
          <Button>Shop</Button>
        </Link>
      </div>
    </div>
  );
};

export default StoreSettings;
