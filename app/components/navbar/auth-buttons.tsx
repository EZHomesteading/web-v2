import Link from "next/link";
const AuthButtons = () => {
  return (
    <>
      <div className={`flex flex-row justify-evenly space-x-3`}>
        <Link href="/auth/login">
          <div className="border-[.5px] border-neutral-200 px-2 rounded-full cursor-pointer">
            Sign In
          </div>
        </Link>
        <Link href="/auth/register">
          <div className="border-[.5px] border-neutral-200 px-2 rounded-full cursor-pointer">
            Sign Up
          </div>
        </Link>
      </div>
    </>
  );
};

export default AuthButtons;
