import { Button } from "../ui/button";

//menu item button component
interface MenuItemProps {
  onClick: () => void;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => {
  return (
    <Button
      onClick={onClick}
      className={`
        p-2
        hover:cursor-pointer
        font-light
         w-full
        text-black
        shadow-none
        text-xs
        justify-between
        items-center
        bg-inherit
        flex
        hover:bg-neutral-700/20
        
        rounded-none
       `}
    >
      <div className="text-[1rem]">{label}</div>
    </Button>
  );
};

export default MenuItem;
