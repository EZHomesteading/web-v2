//base auth forms layout page.
import Image from "next/image";
import authImg from "@/public/images/website-images/authimg2.png";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="absolute z-10 bottom-0 left-0 hidden xl:block">
        <Image
          src={authImg}
          alt="Farmer Holding Basket of Vegetables"
          blurDataURL="data:..."
          placeholder="blur"
          priority={true}
          width={600}
          height={400}
          className="xl:display-hidden"
        />
      </div>
      <div className="authlayoutbg flex items-center justify-center min-h-screen">
        <div>{children}</div>
      </div>
    </>
  );
};

export default AuthLayout;
