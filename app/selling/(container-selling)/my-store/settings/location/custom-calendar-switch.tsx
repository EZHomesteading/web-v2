interface CustomSwitchProps {
  isOpen: boolean;
  onToggle: () => void;
}
const CustomSwitch: React.FC<CustomSwitchProps> = ({ isOpen, onToggle }) => {
  return (
    <div
      className="relative w-36 h-10 bg-gray-300 rounded-full cursor-pointer"
      onClick={onToggle}
    >
      <div className="absolute inset-0 flex items-center justify-evenly text-sm font-medium">
        <span className={`z-10 ${isOpen ? "text-gray-500" : "text-white"}`}>
          Open
        </span>
        <span className={`z-10 ${isOpen ? "text-white" : "text-gray-500"}`}>
          Closed
        </span>
      </div>
      <div
        className={`
              absolute top-1 bottom-1 w-1/2 bg-slate-900 rounded-full
              transition-all duration-300 ease-in-out
              ${isOpen ? "right-1" : "left-1"}
            `}
      />
    </div>
  );
};

export default CustomSwitch;
