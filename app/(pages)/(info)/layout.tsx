import Logo from "@/app/components/navbar/Logo";

const InfoLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="absolute top-1 left-1 z-10">
        <Logo />
      </div>
      <div className="flex h-full items-center justify-center">{children}</div>
    </>
  );
};

export default InfoLayout;
