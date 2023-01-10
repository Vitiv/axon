import React from "react";
import TransferModal from "../../../components/Axon/TransferModal";
import Ledger from "../../../components/Ledger/Ledger";
import Breadcrumbs from "../../../components/Navigation/Breadcrumbs";
import { useAxonById } from "../../../lib/hooks/Axon/useAxonById";
import useAxonId from "../../../lib/hooks/useAxonId";

export default function LedgerPage() {
  const id = useAxonId();
  const { data } = useAxonById();
  
  return (
    <>
      <div className="xs:flex justify-between items-center">
        <Breadcrumbs
          path={[
            { path: `axon/${id}`, label: `Axon ${id}` },
            { path: "ledger", label: "Ledger" },
          ]}
        />
        <TransferModal />
      </div>
      <div className="pt-4">
        <Ledger />
      </div>
    </>
  );
}
