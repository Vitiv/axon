import React, { useEffect, useState } from "react";
import { ProposalType } from "../../declarations/Axon/Axon.did";
import CommandForm from "./CommandForm";
import NeuronSelectionForm from "./NeuronSelectionForm";

export default function NeuronCommandForm({
  setProposal,
}: {
  setProposal: (at: ProposalType) => void;
}) {
  const [neuronIds, setNeuronIds] = useState([]);
  const [command, setCommand] = useState(null);

  useEffect(() => {
    setProposal(
      command
        ? {
            NeuronCommand: [
              {
                command,
                neuronIds: neuronIds.length > 0 ? [neuronIds.map(BigInt)] : [],
              },
              [],
            ],
          }
        : null
    );
  }, [command, neuronIds]);

  return (
    <div className="flex flex-col divide-y divide-gray-300">
      <div className="py-4">
        <CommandForm setCommand={setCommand} />
      </div>
      <div className="py-4">
        <NeuronSelectionForm
          neuronIds={neuronIds}
          setNeuronIds={setNeuronIds}
        />
      </div>
    </div>
  );
}