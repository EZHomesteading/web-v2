"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { outfitFont } from "@/components/fonts";

import ReactDOM from "react-dom";
interface p {
  children: React.ReactNode;
  buttonClassName?: string;
  buttonChildren: React.ReactNode;
  className?: string;
}
const MotionDiv = ({
  children,
  buttonChildren,
  buttonClassName,
  className = " ",
}: p) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={`${buttonClassName}`} onClick={() => setIsOpen(true)}>
        {buttonChildren}
      </button>
      {isOpen &&
        ReactDOM.createPortal(
          <AnimatePresence>
            <>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`fixed inset-0 flex items-center justify-center zmax ${className} ${outfitFont.className}`}
              >
                <div className="relative bg-white rounded-3xl flex flex-col w-full h-full">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-black bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <X size={24} />
                  </button>
                  {children}
                </div>
              </motion.div>
            </>
          </AnimatePresence>,
          document.getElementById("modal-root") || document.body
        )}
    </>
  );
};

export default MotionDiv;
