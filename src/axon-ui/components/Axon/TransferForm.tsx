import { Principal } from "@dfinity/principal";
import React, { useEffect, useState } from "react";
import { AxonCommandRequest } from "../../declarations/Axon/Axon.did";
import { useInfo } from "../../lib/hooks/Axon/useInfo";
import useDebounce from "../../lib/hooks/useDebounce";
import { formatNumber } from "../../lib/utils";
import ErrorAlert from "../Labels/ErrorAlert";

export function TransferForm({
  makeCommand,
}: {
  makeCommand: (cmd: AxonCommandRequest | null) => void;
}) {
  const { data } = useInfo();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const debouncedRecipient = useDebounce(recipient);
  const debouncedAmount = useDebounce(amount);

  useEffect(() => {
    if (!debouncedAmount) return makeCommand(null);

    setError("");
    let maybeRecipient: Principal;
    if (recipient) {
      try {
        maybeRecipient = Principal.fromText(recipient);
      } catch (err) {
        setError("Invalid principal");
        return makeCommand(null);
      }
    }

    makeCommand({
      Transfer: {
        recipient: maybeRecipient,
        amount: BigInt(debouncedAmount),
      },
    });
  }, [debouncedAmount, debouncedRecipient]);

  return (
    <div className="flex flex-col gap-2">
      <label className="block">
        <span>Recipient</span>
        <input
          type="text"
          placeholder="Recipient"
          className="w-full mt-1"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          maxLength={64}
          required
        />
      </label>

      {!!error && <ErrorAlert>{error}</ErrorAlert>}

      <label className="block">
        <div className="flex justify-between">
          <span>Amount</span>
          <span className="text-gray-400">
            Treasury Balance: {formatNumber(data.balance)}
          </span>
        </div>
        <input
          type="number"
          placeholder="Amount"
          className="w-full mt-1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={0}
          required
        />
      </label>
    </div>
  );
}