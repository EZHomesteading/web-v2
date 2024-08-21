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
        px-6
      
        py-3 
        hover:shadow-md
        font-normal
        text-xl
        md:text-lg
        flex
        items-center
        mi"
    >
      <div className="mr-2">{icon}</div>
      {label}
    </div>
  );
};

export default MenuItem;
