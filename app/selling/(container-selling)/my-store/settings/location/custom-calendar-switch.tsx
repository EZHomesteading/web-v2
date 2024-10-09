interface CustomSwitchProps {
  isOpen: boolean;
  onToggle: () => void;
}
const CustomSwitch: React.FC<CustomSwitchProps> = ({ isOpen, onToggle }) => {
  return (
    <div
      className="relative select-none w-48 h-12 bg-gray-300 rounded-full cursor-pointer"
      onClick={onToggle}
    >
      <div className="absolute inset-0 flex items-center justify-evenly text-sm font-medium">
        <span
          className={`z-10 pr-1 ${isOpen ? "text-white" : "text-gray-500"}`}
        >
          Open
        </span>
        <span className={`z-10 ${isOpen ? "text-gray-500" : "text-white"}`}>
          Closed
        </span>
      </div>
      <div
        className={`
              absolute top-1 bottom-1 w-1/2 bg-slate-900 rounded-full
              transition-all duration-3000 ease-in-out
              ${isOpen ? "left-1" : "right-1"}
            `}
      />
    </div>
  );
};

export default CustomSwitch;
