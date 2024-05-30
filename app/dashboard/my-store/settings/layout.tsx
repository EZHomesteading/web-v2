import TopNav from "@/app/dashboard/top-nav";
//settings page parent element
const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TopNav />
      {children}
    </div>
  );
};

export default Layout;
