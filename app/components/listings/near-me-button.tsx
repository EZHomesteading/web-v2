interface Props {
  handleNearMeClick: () => void;
  focus: any;
}
const NearMeButton = ({ focus, handleNearMeClick }: Props) => {
  return (
    <button
      className={`absolute top-full mt-2 py-1 px-4 border-[1px] rounded-lg text-grey w-full ${
        focus.left ? "visible" : "hidden"
      }`}
      onMouseDown={handleNearMeClick}
    >
      Near Me
    </button>
  );
};

export default NearMeButton;
