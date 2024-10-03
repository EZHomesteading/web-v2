"use client";
//default header component
interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle, center }) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className="text-xl sm:text-2xl font-normal">{title}</div>
      <div className="font-light text-neutral-500 mt-0 mb-1 md:text-xs text-[.7rem]">
        {subtitle}
      </div>
    </div>
  );
};

export default Heading;
