import Link from "next/link";

const AuthButtons = () => {
  return (
    <>
      <div
        className={`flex flex-row justify-evenly space-x-3 text-xs lg:text-lg `}
      >
        <Link
          href="/auth/login"
          className="border-[1px] border-neutral-200 px-2 rounded-full cursor-pointer"
        >
          Sign In
        </Link>
        <Link
          href="/auth/register"
          className="border-[1px] border-neutral-200 px-2 rounded-full cursor-pointer"
        >
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default AuthButtons;
