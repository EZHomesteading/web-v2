//profile setup parent component
import { UserInfo } from "@/next-auth";
import ProfileComponent from "./profile-component";

interface Props {
  user: UserInfo;
  formData: any;
  setFormData: any;
}
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
