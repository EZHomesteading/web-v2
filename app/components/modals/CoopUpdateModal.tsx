"use client";

import Modal from "./Modal";
import ClientOnly from "../client/ClientOnly";
import UpdateClient from "@/app/updatetocoop/UpdateClient";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { useState } from "react";
import useCoopUpdateModal from "@/app/hooks/useCoopUpdateModal";

interface IParams {
  listingId?: string;
}

const CoopUpdateModal = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const coopUpdateModal = useCoopUpdateModal();

  const bodyContent = (
    <div>
      <ClientOnly>
        <UpdateClient currentUser={currentUser} />
      </ClientOnly>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={coopUpdateModal.isOpen}
      title=""
      actionLabel="Submit"
      onClose={coopUpdateModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default CoopUpdateModal;
