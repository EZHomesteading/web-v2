"use client";

import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";
import RentModal from "../components/modals/ListingModal";
import SearchModal from "../components/modals/SearchModal";
import CoopRegisterModal from "../components/modals/CoopRegisterModal";
import CoopUpdateModal from "../components/modals/CoopUpdateModal";

const ModalsProvider = () => {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <SearchModal />
      <RentModal />
      <CoopRegisterModal />
      <CoopUpdateModal />
    </>
  );
};

export default ModalsProvider;
