import Image from "next/image";
import authImg from "@/public/images/home-images/authimg2.png";
import Logo from "../components/navbar/Logo";
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="absolute top-1 left-1 z-10">
        <Logo />
      </div>
      <div className="absolute z-10 bottom-0 left-0 hidden xl:block">
        <Image
          src={authImg}
          alt="Farmer Holding Basket of Vegetables"
          blurDataURL="data:..."
          placeholder="blur"
          width={800}
          height={600}
          className="xl:display-hidden"
        />
      </div>
      <div className="authlayoutbg flex min-h-screen items-center justify-center relative">
        <div className="xl:absolute relative top-0 xl:right-12 right-0 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
