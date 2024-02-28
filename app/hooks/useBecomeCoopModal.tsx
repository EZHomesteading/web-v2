import { create } from "zustand";

interface BecomeCoopModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useBecomeCoopModal = create<BecomeCoopModalStore>((set) => ({
  isOpen: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useBecomeCoopModal;
