"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import Modal from "@/components/modals/chatmodals/Modal";
import Input from "./input";
import { useForm } from "react-hook-form";
import { FormValues } from "./input";
import { Button } from "@/components/ui/button";
interface StripeCard {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  funding: string;
  country: string;
}

const getBrandLogo = (brand: string) => {
  const logos: { [key: string]: string } = {
    visa: "/images/cards/Visa_Logo.png",
    mastercard: "/images/cards/MasterCardLogo.png",
    amex: "/images/cards/AMEXLogo.png",
    discover: "/images/cards/DiscoverLogo.png",
  };
  return logos[brand.toLowerCase()] || "";
};

const getCardBackground = (brand: string) => {
  const backgrounds: { [key: string]: string } = {
    visa: "from-blue-600 to-blue-400",
    mastercard: "from-orange-600 to-red-400",
    amex: "from-green-600 to-green-400",
    discover: "from-purple-600 to-purple-400",
  };
  return backgrounds[brand.toLowerCase()] || "from-gray-400 to-gray-600";
};

const PaymentMethods: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const watchedFields = watch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [cards, setCards] = useState<StripeCard[]>([
    {
      id: "card_1MvoiELkdIwHu7ixOeFGbN9D",
      brand: "Visa",
      last4: "4242",
      exp_month: 4,
      exp_year: 2024,
      funding: "credit",
      country: "US",
    },
    {
      id: "card_2NwpjFMleJxIv8jyPfGHcO0E",
      brand: "Mastercard",
      last4: "5678",
      exp_month: 8,
      exp_year: 2025,
      funding: "debit",
      country: "UK",
    },
    {
      id: "card_3OxqkGNmfKyJw9kzQgHIdP1F",
      brand: "Amex",
      last4: "9012",
      exp_month: 12,
      exp_year: 2026,
      funding: "credit",
      country: "CA",
    },
  ]);

  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [cardStyle, setCardStyle] = useState({ width: "100%", height: "auto" });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCardSize = () => {
      const dpi = 115;
      const cardWidthInches = 3.375;
      const cardHeightInches = 2.125;
      const cardWidthPixels = cardWidthInches * dpi;
      const cardHeightPixels = cardHeightInches * dpi;

      const containerWidth =
        containerRef.current?.clientWidth || window.innerWidth - 32;

      if (containerWidth >= cardWidthPixels) {
        setCardStyle({
          width: `${cardWidthPixels}px`,
          height: `${cardHeightPixels}px`,
        });
      } else {
        const scale = containerWidth / cardWidthPixels;
        setCardStyle({
          width: "100%",
          height: `${cardHeightPixels * scale}px`,
        });
      }
    };

    updateCardSize();
    window.addEventListener("resize", updateCardSize);
    return () => window.removeEventListener("resize", updateCardSize);
  }, []);

  const removeCard = (id: string) => {
    setCards(cards.filter((card) => card.id !== id));
    if (activeCardId === id) {
      setActiveCardId(null);
    }
  };

  const toggleCard = (id: string) => {
    setActiveCardId(activeCardId === id ? null : id);
  };

  return (
    <div className="max-w-3xl" ref={containerRef}>
      <h2 className="text-2xl font-medium pb-6">Payment Methods</h2>
      <div className="space-y-4 relative">
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: 1,
                y: activeCardId === card.id ? 0 : index * 40,
                zIndex:
                  activeCardId === card.id
                    ? cards.length
                    : cards.length - index,
              }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl shadow-md overflow-hidden absolute w-full bg-gradient-to-r ${getCardBackground(
                card.brand
              )} cursor-pointer`}
              style={{
                ...cardStyle,
                top: 0,
              }}
              onClick={() => toggleCard(card.id)}
            >
              <div className="p-4 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCard(card.id);
                    }}
                    className="text-white hover:text-red-300 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="text-white">
                  <div className="text-xl sm:text-2xl font-bold mb-2">
                    **** **** **** {card.last4}
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>
                      {card.exp_month.toString().padStart(2, "0")}/
                      {card.exp_year.toString().slice(-2)}
                    </span>
                    <span className="uppercase">
                      <img
                        src={getBrandLogo(card.brand)}
                        alt={`${card.brand} logo`}
                        className="h-6"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div
        style={{
          height: `${
            (cards.length - 1) * 50 + parseInt(cardStyle.height as string, 10)
          }px`,
        }}
      />
      <div style={{ ...cardStyle, marginTop: "1rem" }}>
        <button
          onClick={openModal}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
        >
          <Plus size={24} className="mr-2" />
          Add New Card
        </button>
      </div>
      <Modal
        bgWhite={true}
        showX={false}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <div className="flex flex-col">
          <Input
            id="cardNumber"
            label="Card Number"
            register={register}
            errors={errors}
            type="cardNumber"
            roundT={true}
          />
          <div className="flex flex-row">
            <Input
              id="expirationDate"
              label="Expiry Date"
              register={register}
              errors={errors}
              roundLB={true}
            />
            <Input
              id="ccv"
              label="CCV"
              register={register}
              errors={errors}
              roundRB={true}
            />
          </div>
          <div className="mt-2 pb-3">
            <Input
              id="zipCode"
              label="Zip Code"
              register={register}
              errors={errors}
              round={true}
            />
          </div>
          <hr className="pb-3" />
          <div className="flex justify-between !font-light items-center">
            <Button
              className="font-light"
              onClick={() => setIsModalOpen(false)}
              variant={`outline`}
            >
              Cancel
            </Button>
            <Button
              className="font-light"
              onClick={() => setIsModalOpen(false)}
            >
              Add Card
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentMethods;
