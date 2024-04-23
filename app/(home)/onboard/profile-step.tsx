import { UserInfo } from "@/next-auth";

interface Props {
  user: UserInfo;
  formData: any;
  setFormData: any;
}
const ProfileStep = ({ formData, user }: Props) => {
  return (
    <>
      <div>profile step</div>
    </>
  );
};

export default ProfileStep;
