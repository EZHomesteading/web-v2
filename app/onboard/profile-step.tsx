//profile setup parent component
import { ExtendedHours, UserInfo } from "@/next-auth";
import ProfileComponent from "./profile-component";
import { Dispatch, SetStateAction } from "react";

interface Props {
  user: UserInfo;
  formData: FormData;
  setFormData: Dispatch<
    SetStateAction<{
      hours?: ExtendedHours | undefined;
      image?: string | undefined;
      bio?: string | undefined;
    }>
  >;
}
type FormData = {
  hours?: ExtendedHours | undefined;
  image?: string | undefined;
  bio?: string | undefined;
};
const ProfileStep = ({ setFormData, formData, user }: Props) => {
  return (
    <>
      <div className="flex flex-col items-center w-full pt-2">
        {user ? (
          <ProfileComponent
            user={user}
            setFormData={setFormData}
            formData={formData}
          />
        ) : (
          <div className="flex items-center justify-center">
            You must be logged in as a co-op to access this page
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileStep;
