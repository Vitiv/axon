import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { ManageNeuron } from "../../declarations/Axon/Axon.did";
import {
  Command,
  NeuronId,
} from "../../declarations/Governance/Governance.did.d";

import { Action } from "../../declarations/Axon/Axon.did";
import useDebounce from "../../lib/hooks/useDebounce";
import useNeuronOptions from "../../lib/hooks/useNeuronOptions";
import ErrorAlert from "../Labels/ErrorAlert";
import CommandForm from "./CommandForm";

/** @todo use address book selector for neurons */
export default function ManageNeuronForm({
  setAction,
  defaults,
}: {
  setAction: (cmd: Action | null) => void;
  defaults?: ManageNeuron;
}) {
  const defaultNeuronId = defaults?.id[0].id.toString();
  const [neuronId, setNeuronId] = useState(defaultNeuronId ?? "");
  const [command, setCommand] = useState(defaults?.command[0] ?? null);
  const [error, setError] = useState("");

  const neuronOptions = useNeuronOptions();
  const debouncedNeuronId = useDebounce(neuronId);

  useEffect(() => {
    setError("");

    if (!neuronId || !command) {
      return setAction(null);
    }

    let id: [NeuronId];
    try {
      id = [{ id: BigInt(neuronId) }];
    } catch (error) {
      return setError("Invalid Neuron ID");
    }

    setAction({
      ManageNeuron: {
        id,
        command: [command],
      },
    });
  }, [debouncedNeuronId, command]);

  return (
    <div className="flex flex-col gap-2">
      <label className="block">
        Neuron ID
        <CreatableSelect
          className="react-select"
          onChange={({ value }) => setNeuronId(value)}
          options={neuronOptions}
          defaultValue={
            defaults
              ? { value: defaultNeuronId, label: defaultNeuronId }
              : undefined
          }
        />
      </label>

      {!!error && <ErrorAlert>{error}</ErrorAlert>}

      <CommandForm
        setCommand={setCommand}
        defaultCommand={defaults?.command[0]}
        neuronIds={[neuronId]}
      />
    </div>
  );
}
