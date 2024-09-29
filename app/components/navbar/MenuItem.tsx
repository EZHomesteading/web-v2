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
        text-lg
        sm:text-sm
        flex
        items-center
        justify-between
        mi"
    >
      {label}
      <div>{icon}</div>
    </div>
  );
};

export default MenuItem;
