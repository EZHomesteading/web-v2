import TopNav from "../top-nav";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full">
      <TopNav />
      {children}
    </div>
  );
};

export default Layout;
