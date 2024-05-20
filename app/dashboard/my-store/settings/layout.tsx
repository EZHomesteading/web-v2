import TopNav from "@/app/dashboard/top-nav";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TopNav />
      {children}
    </div>
  );
};

export default Layout;
