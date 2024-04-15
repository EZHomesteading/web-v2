import getUsers from "../../../actions/user/getUsers";
import UserList from "./components/UserList";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    <div className="h-full">
      <UserList items={users} />
      {children}
    </div>
  );
}
