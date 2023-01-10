import React from "react";
import { ProposalType } from "../../declarations/Axon/Axon.did";
import { getActionTime, getStatus } from "../../lib/axonProposal";
import { useIsProposer } from "../../lib/hooks/Axon/useIsProposer";
import { useMyBallot } from "../../lib/hooks/Axon/useMyBallot";
import { useProposal } from "../../lib/hooks/Axon/useProposal";
import useAxonId from "../../lib/hooks/useAxonId";
import {
  hasExecutionError,
  proposalTypeToString,
} from "../../lib/proposalTypes";
import { principalIsEqual } from "../../lib/utils";
import AxonCommandSummary from "../Axon/AxonCommandSummary";
import CanisterCommandSummary from "../Axon/CanisterCommandSummary";
import PolicySummary from "../Axon/PolicySummary";
import IdentifierLabelWithButtons from "../Buttons/IdentifierLabelWithButtons";
import { RefreshButton } from "../Buttons/RefreshButton";
import NeuronCommandSummary from "../Commands/NeuronCommandSummary";
import Panel from "../Containers/Panel";
import StatusLabel from "../Labels/StatusLabel";
import { TimestampLabel } from "../Labels/TimestampLabel";
import Breadcrumbs from "../Navigation/Breadcrumbs";
import { useGlobalContext } from "../Store/Store";
import AcceptRejectButtons from "./AcceptRejectButtons";
import CancelButton from "./CancelButton";
import ExecuteButton from "./ExecuteButton";
import RepeatProposalButton from "./RepeatProposalButton";
import StatusHistory from "./StatusHistory";
import VotesTable from "./VotesTable";
import VoteSummary from "./VoteSummary";

export const ProposalDetails = ({ proposalId }: { proposalId: string }) => {
  const {
    state: { principal },
  } = useGlobalContext();
  const axonId = useAxonId();
  const {
    data: proposal,
    refetch,
    isFetching,
    isError,
  } = useProposal(proposalId);
  const isProposer = useIsProposer();

  const myBallot = useMyBallot(proposal);
  const status = proposal ? getStatus(proposal) : null;
  const actionTime = proposal ? getActionTime(proposal) : null;

  if (isError) {
    return (
      <Panel className="mt-12 py-16 text-center text-gray-500 text-sm custom-panel">
        Proposal {proposalId} not found
      </Panel>
    );
  }

  const isEligibleToVote =
    (status === "Active" ||
      (status === "Created" && actionTime.diffNow().toMillis() < 0)) &&
    myBallot &&
    !myBallot.vote[0];

  const isCancellable =
    principalIsEqual(proposal?.creator, principal) &&
    (status === "Accepted" || status === "Active" || status === "Created");
  const isExecutable = isProposer && status === "Accepted";

  return (
    <>
      <div className="sm:flex justify-between items-center">
        <Breadcrumbs
          path={[
            { path: `axon/${axonId}`, label: `Axon ${axonId}` },
            {
              path: `/proposal/${proposalId}`,
              label: `Proposal ${proposalId}`,
            },
          ]}
        />
        <div className="flex gap-2">
          {isEligibleToVote && <AcceptRejectButtons proposal={proposal} />}
          {isExecutable && <ExecuteButton proposalId={proposal.id} />}
          {isCancellable && <CancelButton proposal={proposal} />}
          {isProposer && proposal && (
            <RepeatProposalButton proposal={proposal.proposal} />
          )}
        </div>
      </div>
      <div className="pt-4 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Panel className="p-4 flex-1 custom-panel">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
                <div className="inline-flex items-center gap-2">
                  <h2 className="text-xl font-bold">
                    {proposal && proposalTypeToString(proposal.proposal)}
                  </h2>
                  <RefreshButton
                    isFetching={isFetching}
                    onClick={refetch}
                    title="Refresh"
                  />
                </div>
              </div>
              <div className="xs:flex items-center gap-4">
                {proposal && (
                  <StatusLabel
                    status={status}
                    hasExecutionError={hasExecutionError(proposal.proposal)}
                  />
                )}
                {!!actionTime && (
                  <>
                    {status === "Created" && "Starts "}
                    {status === "Active" && "Ends "}
                    <TimestampLabel dt={actionTime} />
                  </>
                )}
              </div>
              <div className="flex flex-col xs:flex-row xs:gap-4">
                <span className="text-gray-400 whitespace-nowrap">
                  ID {proposalId}
                </span>
                <span>
                  Created by{" "}
                  {proposal && (
                    <IdentifierLabelWithButtons
                      type="Principal"
                      id={proposal.creator}
                    />
                  )}
                </span>
              </div>
            </div>
          </Panel>

          <Panel className="p-4 flex-1 custom-panel">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl">Policy</h2>
              {proposal && <PolicySummary policy={proposal.policy} />}
            </div>
          </Panel>
        </div>

        <Panel className="custom-panel">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl">Action</h2>
            {proposal && <ProposalTypeSummary proposal={proposal.proposal} />}
          </div>
        </Panel>

        <Panel className="custom-panel">
          <div className="flex flex-col gap-2 md:gap-12 md:flex-row leading-tight divide-y divide-gray-200 md:divide-none">
            <div className="flex flex-col gap-2 md:flex-1 pb-4">
              <h2 className="text-xl">Votes</h2>
              {proposal && <VoteSummary proposal={proposal} />}
              {proposal && <VotesTable proposal={proposal} />}
            </div>
            <div className="flex flex-col gap-2 md:flex-1 pt-4 md:pt-0">
              <h2 className="text-xl">History</h2>
              {proposal && <StatusHistory proposal={proposal} />}
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
};

const ProposalTypeSummary = ({ proposal }: { proposal: ProposalType }) => {
  if ("AxonCommand" in proposal) {
    return <AxonCommandSummary axonCommand={proposal.AxonCommand} />;
  } else {
    if ("CanisterCommand" in proposal)
     return <CanisterCommandSummary canisterCommand={proposal.CanisterCommand} />
    
    return <NeuronCommandSummary neuronCommand={proposal.NeuronCommand} />;
  }
};
