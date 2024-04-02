interface MenuItemProps {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, icon }) => {
  return (
    <div
      onClick={onClick}
      className={`
        px-4 
        py-3 
        hover:bg-green-100 
        hover:shadow-md
        hover:text-green-600
        font-semibold
        text-sm
        flex
        items-center
  
        `}
    >
      <div className="mr-2">{icon}</div>
      {label}
    </div>
  );
};

export default MenuItem;
