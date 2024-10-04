"use client";
//default modal template specifically for chat components
import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  bgWhite?: boolean;
  showX?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  bgWhite = false,
  isOpen,
  onClose,
  children,
  showX = true,
}) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-100"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="
              fixed 
              inset-0 
              bg-black/80
            "
          />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className="
              flex 
              min-h-full 
              items-center 
              justify-center 
              p-4 
              text-center 
              sm:p-0 h-[80%]
            "
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={` relative 
    transform 
    overflow-y-auto 
    rounded-lg 
    px-4 
    ${!bgWhite ? `bg-green-100` : `bg-white`}
    pb-4
    pt-5 
    text-left 
    shadow-xl 
    transition-all
    max-h-[90vh]
    w-full
    lg:max-w-6xl
    md-custom:max-w-3xl
    max-w-lg
    flex
    flex-col
    items-center
    sm:p-6`}
              >
                {showX && (
                  <div
                    className="
                    absolute 
                    right-0 
                    top-0 
                    hidden 
                    pr-4 
                    pt-4 
                    sm:block
                    z-10
                  "
                  >
                    <button
                      type="button"
                      className="
                      rounded-md
                      bg-white
                      text-gray-400
                      hover:text-gray-500
               
                      absolute top-1 right-1
                    "
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <IoClose className="h-5 w-5 " />
                    </button>
                  </div>
                )}

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
