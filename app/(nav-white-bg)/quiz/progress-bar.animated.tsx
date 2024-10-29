import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedResultBar = ({
  coopPercentage,
  producerPercentage,
  recommendedRole,
}: {
  coopPercentage: number;
  producerPercentage: number;
  recommendedRole: string;
}) => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStage(1), 1000); // After drop animation
    const timer2 = setTimeout(() => setAnimationStage(2), 2000); // After empty animation
    const timer3 = setTimeout(() => setAnimationStage(3), 3000); // After refill animation
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full h-48 flex flex-col items-center justify-center">
      <motion.div
        className="w-full h-8 bg-gray-200 rounded-md shadow-md overflow-hidden relative mb-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1 }}
      >
        <AnimatePresence>
          {animationStage < 2 && (
            <motion.div
              className="absolute top-0 left-0 h-full bg-black"
              initial={{ width: "100%" }}
              animate={{ width: animationStage >= 1 ? "0%" : "100%" }}
              exit={{ width: "0%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {animationStage >= 2 && (
            <motion.div
              className="absolute top-0 left-0 h-full flex"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1 }}
            >
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: `${coopPercentage}%` }}
                transition={{ duration: 1 }}
              />
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: "0%" }}
                animate={{ width: `${producerPercentage}%` }}
                transition={{ duration: 1 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {animationStage >= 3 && (
          <motion.div
            className="text-center text-3xl font-light absolute top-1/4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            We recommend you become a {recommendedRole}.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedResultBar;
