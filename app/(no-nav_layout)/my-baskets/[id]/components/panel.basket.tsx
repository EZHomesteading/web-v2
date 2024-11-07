import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { outfitFont } from "@/components/fonts";
import TimePicker from "./time.basket";
import { DeliveryPickupToggleMode } from "../../../../(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";

export interface PanelProps {
  content: ReactNode;
  onClose: () => void;
}

interface StackingPanelLayoutProps {
  children: ReactNode;
  mode?: DeliveryPickupToggleMode;
  isBasePanelOpen: boolean;
  setIsBasePanelOpen: (isOpen: boolean) => void;
  handleTimeChange: any;
  over_600px: boolean;
}

const PanelCart: React.FC<StackingPanelLayoutProps> = ({
  children,
  mode,
  isBasePanelOpen,
  setIsBasePanelOpen,
  handleTimeChange,
  over_600px,
}) => {
  const panel: PanelProps = {
    content: (
      <div
        className={`${outfitFont.className} text-lg w-full flex flex-col gap-y-3 items-center justify-center text-start pt-3`}
      >
        <Button
          onClick={() => {
            setIsBasePanelOpen(false);
          }}
          className="w-full my-2 border py-8 justify-center flex relative"
        >
          <div className="text-md sm:text-xl font-light">Back to Calendar</div>
        </Button>
        <div className={`grid grid-cols-2`}>
          <div className={``}>Available Times</div>
          <div className={``}>
            <TimePicker
              value={`9:00 AM`}
              onChange={handleTimeChange}
              mode={mode}
            />
          </div>
        </div>
        <div className="flex w-full justify-between">
          <button
            className="underline"
            // onClick={resetForm}
          >
            Reset
          </button>
          <button
            className={`${outfitFont.className} text-white bg-black px-3 py-2 rounded-full border `}
            // onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    ),
    onClose: () => {
      setIsBasePanelOpen(false);
    },
  };

  return (
    <div className="flex flex-row border-t overflow-hidden">
      <motion.div
        initial="closed"
        animate={isBasePanelOpen ? "open" : "closed"}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {isBasePanelOpen && (
          <motion.div className="relative">
            <motion.div
              className={`bg-white fixed bottom-0 left-0 right-0"
                `}
              style={{
                position: "fixed",
                zIndex: 50,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                top: 0,
              }}
              initial={{ y: "-150%" }}
              animate={{ y: 0 }}
              exit={{ y: "200%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className={`px-6 relative`}>{panel.content}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PanelCart;
