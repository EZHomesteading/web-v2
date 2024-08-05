import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex flex-col h-screen items-center justify-center"
      style={{ marginTop: "-10%" }}
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <div className="my-4 h-1 w-16 bg-gray-300 mx-auto"></div>
        <h2 className="text-xl mb-8">This page could not be found.</h2>
        <div className="flex justify-center space-x-4">
          <Link
            href="/"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
          >
            Home
          </Link>
          <Link
            href="/market"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
          >
            Market
          </Link>{" "}
          <Link
            href="/chat"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
          >
            Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
