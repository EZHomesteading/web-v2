import { AccordionFaq } from "./components/accordion";
const SupportPage = async () => {
  return (
    <div className="flex flex-col items-center justify-center h-auto pt-[100px] ">
      <div className="mb-[20px] text-3xl  text-center bg-green-800 text-white rounded-lg px-4 py-2">
        <div>Contact us</div>
        <div className="text-2xl">Email: support@EzHomesteading.com</div>
        <div className="text-2xl">Phone: (555)-555-5555</div>
      </div>
      <div>
        Note: We are a very small team, we will do our best to get to your
        issues as soon as possible. But please be patient.
      </div>
      <div className=" text-xs sm:text-sm md:text-md lg:text-lg font-bold tracking-tight mb-2 text-grey mt-[70px] xl:block">
        FAQ
      </div>
      <div className=" flex xl:w-1/3  md:w-1/2 w-[95%] mx-auto  mb-auto pb-[30px]">
        <AccordionFaq />
      </div>
    </div>
  );
};

export default SupportPage;
