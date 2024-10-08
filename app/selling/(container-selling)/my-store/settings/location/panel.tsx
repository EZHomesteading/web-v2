import React, { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResponsiveSlidingLayoutProps {
  children: ReactNode;
  panel: ReactNode;
  isPanelOpen: boolean;
  onPanelClose: () => void;
  isDesktop: boolean;
  isTallMobile: boolean;
  mainContentVariants: any;
  panelVariants: any;
}

const ResponsiveSlidingLayout: React.FC<ResponsiveSlidingLayoutProps> = ({
  children,
  panel,
  isPanelOpen,
  onPanelClose,
  isDesktop,
  isTallMobile,
  panelVariants,
  mainContentVariants,
}) => {
  const getPanelStyle = () => {
    if (isDesktop) {
      return {
        position: "fixed" as const,
        right: 0,
        top: 0,
        bottom: 0,
        width: "384px",
      };
    } else {
      return {
        position: "fixed" as const,
        left: 0,
        right: 0,
        bottom: 0,
        height: isTallMobile ? "50%" : "100%",
      };
    }
  };
  return (
    <div className="flex flex-col sheet sm:flex-row min-h-screen overflow-hidden">
      <motion.div
        className="flex-grow overflow-y-auto"
        variants={mainContentVariants}
        initial="closed"
        animate={isPanelOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            className={`sheet border-l overflow-y-auto z-50 border-t ${
              isDesktop ? "w-96" : "fixed bottom-0 left-0 right-0"
            }`}
            initial={isDesktop ? "closed" : "closed"}
            animate="open"
            exit="closed"
            variants={isDesktop ? panelVariants.desktop : panelVariants.mobile}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              <button
                onClick={onPanelClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
              {panel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResponsiveSlidingLayout;
