import { create } from "zustand";

interface CoopUpdateModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useCoopUpdateModal = create<CoopUpdateModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useCoopUpdateModal;
