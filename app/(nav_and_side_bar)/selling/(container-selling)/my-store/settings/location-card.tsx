import Link from "next/link";

interface AccountCardProps {
  id: string;
  locationHeading: string;
  address: string;
}

const AccountCard: React.FC<AccountCardProps> = ({
  id,
  locationHeading,
  address,
}) => {
  return (
    <>
      <div
        className={`pt-5 transition-opacity duration-300 
        ${!address ? "opacity-50 pointer-events-none" : "opacity-100"}
    `}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="text-md font-normal">{locationHeading}</div>
            <p className="text-sm text-gray-500 truncate max-w-[300px] sm:max-w-[500px] md:max-w-[600px]">
              {address}
            </p>
          </div>
          <Link href={`/selling/availability-calendar/${id}`}>
            <button
              className="font-extralight text-xs border p-1 rounded-md w-[50px]"
              // disabled={isDisabled}
            >
              {address ? "Edit " : "Edit"}
            </button>
          </Link>
        </div>
        <div className="border-b-[1px] pb-3 mt-3 " />{" "}
      </div>
    </>
  );
};

export default AccountCard;
