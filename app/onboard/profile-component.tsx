//profile setup page for extra information for onboarding COOP's / Producers
import Avatar from "@/app/components/Avatar";
//import ImageUpload from "@/app/components/inputs/profile-img-upload";
import { Card, CardContent } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { UserInfo } from "@/next-auth";
import { UploadButton } from "@/utils/uploadthing";
import { Outfit } from "next/font/google";
import { ChangeEvent, useState } from "react";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: "300",
});

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
  const [image, setImage] = useState(user?.image);
  return (
    <Card className="flex flex-col bg-inherit border-none shadow-xl md:mt-20 lg:w-2/3 w-5/6">
      <CardContent className="onboard-right rounded-lg p-0">
        <Card className=" border-none">
          <CardContent className="flex items-center onboard-right w-full">
            <div className="flex justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <Label>Profile Image</Label>
                <Avatar image={image} />
              </div>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res: any) => {
                  handleImageChange;
                  setImage(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                appearance={{
                  container: "h-full w-max",
                }}
                className="ut-allowed-content:hidden ut-button:bg-white ut-button:text-black ut-button:w-fit ut-button:px-2 ut-button:h-full"
                content={{
                  button({ ready }) {
                    if (ready)
                      return (
                        <div className={`${outfit.className}`}>
                          Upload Image
                        </div>
                      );
                    return "Getting ready...";
                  },
                }}
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
              className="h-24 sm:h-32"
              onChange={handleBioChange}
              value={formData.bio || user?.bio || ""}
              maxLength={300}
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ProfileComponent;
