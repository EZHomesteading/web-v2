import { MdKeyboardArrowRight } from "react-icons/md";

const FinTab = ({ label }: { label: string }) => {
  return (
    <div className="md:w-[75%] lg:w-[50%] xl:w-[40%] 2xl:w-[55%]">
      <div className="flex justify-between mx-5 items-center text-slate-300 ">
        <li>{label}</li>
        <MdKeyboardArrowRight />
      </div>
      <div className="my-5 border border-b-[1px]"></div>
    </div>
  );
};
export default FinTab;
