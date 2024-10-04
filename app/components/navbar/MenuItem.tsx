//menu item button component
interface MenuItemProps {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, icon }) => {
  return (
    <div
      onClick={onClick}
      className="
        p-2
        hover:shadow-sm
        hover:cursor-pointer
        font-normal
        text-xl
        sm:text-sm
        flex
        items-center
        "
    >
      <div className="mr-2 ">{icon}</div>
      <div className="text-lg">{label}</div>
    </div>
  );
};

export default MenuItem;
