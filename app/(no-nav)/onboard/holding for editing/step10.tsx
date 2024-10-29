import CenteredStep from "./explanation";

const StepTen = () => {
  return (
    <CenteredStep
      stepNumber={3}
      title="Set Up Payouts"
      description="Lastly, EZHomesteading partners with Stripe for both payments and payouts. The information you provide here is required by government regulation to protect yourself and others against fraud. You can skip this step for now, but the funds from any completed orders will be held in escrow under your account name until this is set up."
    />
  );
};

export default StepTen;
