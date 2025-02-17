interface MenuItemProps {
  onClick: () => void;
  label: string;
}

const MenuItem = ({ onClick, label }: MenuItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        p-2
        hover:cursor-pointer
        font-normal
        w-full
        text-md
        text-start
       `}
    >
      {label}
    </button>
  );
};

export default MenuItem;
