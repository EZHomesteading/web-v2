import { Outfit } from "next/font/google";
import { useState } from "react";
import { Textarea } from "../components/ui/textarea";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
interface Props {
  userBio?: string;
  updateFormData: (data: { bio: string }) => void;
}

const StepNine: React.FC<Props> = ({ userBio, updateFormData }) => {
  const [bio, setBio] = useState(userBio || "");

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
    updateFormData({ bio: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className={`${outfit.className} text-xl sm:text-2xl mb-5`}>
        {userBio ? <>Change your Bio</> : <>Add a Store Bio</>}
      </h1>
      <Textarea
        value={bio}
        onChange={handleBioChange}
        placeholder="Tell us about yourself..."
        className="w-full max-w-md h-40 p-2 border rounded"
      />
    </div>
  );
};

export default StepNine;
