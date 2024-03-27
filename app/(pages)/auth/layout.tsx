import Image from "next/image";
import authImg from "@/public/images/home-images/authImg.jpeg";
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="authlayoutbg flex min-h-screen items-center justify-center relative">
        <div className="absolute bottom-0 left-0 hidden 2xl:block">
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
        <div className="absolute top-0 xl:right-12 right-0 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
