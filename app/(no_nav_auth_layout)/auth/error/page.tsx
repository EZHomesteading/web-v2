//server layout for auth error
import { CardWrapper } from "../(components)/login/auth-card-wrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const AuthErrorPage = () => {
  return (
    <CardWrapper backButtonHref="/auth/login" backButtonLabel="Back to login">
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};

export default AuthErrorPage;
