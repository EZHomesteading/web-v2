import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Component() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return <p>Signed in </p>;
  }
  return <Link href="/">not signed in</Link>;
  //   return <a href="/api/auth/signin">Sign in</a>;
}
