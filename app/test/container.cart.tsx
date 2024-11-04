interface p {
  title: string;
  children: React.ReactNode;
}
const ContainerCart = ({ title, children }: p) => {
  return (
    <div className={`flex flex-col justify-center items-center h-full `}>
      <div className={`text-2xl my-3`}> {title} </div>
      <div>{children}</div>
    </div>
  );
};

export default ContainerCart;
