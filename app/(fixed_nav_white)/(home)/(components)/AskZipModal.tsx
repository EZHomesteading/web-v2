import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { OutfitFont } from "@/components/fonts";

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationData {
  zipCode: string;
  coordinates: Coordinates;
}

interface ZippopotamResponse {
  "post code": string;
  places: Array<{
    latitude: string;
    longitude: string;
    "place name": string;
    state: string;
  }>;
}

interface AskZipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AskZipModal = ({ isOpen, onClose }: AskZipModalProps) => {
  const [zipCode, setZipCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
  };

  const fetchCoordinates = async (zip: string): Promise<Coordinates> => {
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!response.ok) {
        throw new Error("Invalid zip code");
      }
      const data: ZippopotamResponse = await response.json();
      return {
        lat: parseFloat(data.places[0].latitude),
        lng: parseFloat(data.places[0].longitude),
      };
    } catch (error) {
      throw new Error("Unable to find location for this zip code");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!validateZipCode(zipCode)) {
      setError("Please enter a valid ZIP code");
      return;
    }

    setLoading(true);
    try {
      const coords = await fetchCoordinates(zipCode);
      const locationData: LocationData = {
        zipCode,
        coordinates: coords,
      };

      localStorage.setItem("userLocation", JSON.stringify(locationData));

      const searchParams = new URLSearchParams({
        lat: coords.lat.toString(),
        lng: coords.lng.toString(),
        radius: "20",
        zip: zipCode,
      });

      onClose();
      router.push(`/market?${searchParams.toString()}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`p-3 m-0 w-[calc(100%-1rem)] max-w-sm rounded-sm ${OutfitFont.className}`}
      >
        <DialogTitle className={`mt-1`}>
          Help us find produce near you
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="zipCode"
              className="block text-sm font-normal text-gray-700 mb-1"
            >
              Please enter your zip code to ensure results are local
            </label>
            <Input
              id="zipCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              value={zipCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setZipCode(e.target.value)
              }
              placeholder="ZIP Code"
              className={`w-full rounded-sm h-12 border-custom shadow-sm font-normal`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          <div className="flex justify-between">
            <button
              className={`border border-custom px-2 rounded-sm`}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {loading ? "Finding location..." : "Find Produce"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AskZipModal;
