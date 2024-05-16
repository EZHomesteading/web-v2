import Avatar from "@/app/components/Avatar";
import ImageUpload from "@/app/components/inputs/profile-img-upload";
import { Card, CardContent } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { UserInfo } from "@/next-auth";
import { ChangeEvent } from "react";

interface Props {
  user: UserInfo;
  formData: any;
  setFormData: any;
}

const ProfileComponent = ({ user, formData, setFormData }: Props) => {
  const handleImageChange = (value: string) => {
    setFormData((prevData: any) => ({
      ...prevData,
      image: value,
    }));
  };

  const handleBioChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setFormData((prevData: any) => ({
      ...prevData,
      bio: value,
    }));
  };

  return (
    <Card className="grid w-full gap-2 bg lg:w-1/2 h-1/6 pt-2">
      <CardContent className="">
        <Card className="bg-inherit border-none">
          <CardContent className="flex flex-row items-center">
            <div className="">
              <Label>Profile Image</Label>
              <ImageUpload
                onChange={handleImageChange}
                value={formData.image || user?.image}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-inherit border-none">
          <CardContent>
            <Label htmlFor="message">Bio</Label>
            <Textarea
              placeholder="Add info you would like for people to know about you and your EZH store here."
              id="message"
              onChange={handleBioChange}
              value={formData.bio || user?.bio}
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ProfileComponent;
