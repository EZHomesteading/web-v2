import CenteredStep from "./explanation";

const StepOne = () => {
  return (
    <CenteredStep
      stepNumber={1}
      title="Set Up Your Store"
      description="First, we'll ask you for the location you'll be selling produce from most frequently. This will give you a default location to sell from, making listing your produce quick & easy. Next, you'll need to set open and close hours at that location, which is when buyers can pick up produce from you."
    />
  );
};

export default StepOne;
