//error card component for auth
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardWrapper } from "./login/card-wrapper-login";

export const ErrorCard = () => {
  return (
    <CardWrapper backButtonHref="/auth/login" backButtonLabel="Back to login">
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
