"use client";

import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";
import RentModal from "../components/modals/RentModal";
import SearchModal from "../components/modals/SearchModal";
import BecomeCoopModal from "../components/modals/BecomeCoopModal";

const ModalsProvider = () => {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <SearchModal />
      <RentModal />
      <BecomeCoopModal />
    </>
  );
};

export default ModalsProvider;
