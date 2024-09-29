//auth headers
interface HeaderProps {
  label: string;
  label2: string;
}

export const Header = ({ label, label2 }: HeaderProps) => {
  return (
    <>
      <div className="w-full flex flex-col gap-y-4 items-start justify-center">
        <p className="text-muted-foreground text-2xl">{label}</p>
        <p className="text-muted-foreground text-sm">{label2}</p>
      </div>
    </>
  );
};
