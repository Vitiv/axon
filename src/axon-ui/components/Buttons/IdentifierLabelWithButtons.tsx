import { Principal } from "@dfinity/principal";
import classNames from "classnames";
import React from "react";
import { NeuronId } from "../../declarations/Axon/Axon.did";
import useNames from "../../lib/hooks/useNames";
import { shortAccount, shortPrincipal } from "../../lib/utils";
import CopyButton from "./CopyButton";
import ExternalLinkButton from "./ExternalLinkButton";
import { principalToAccountDefaultIdentifier } from "../../lib/account";

export type IdentifierRenderProps = {
  rawId: string;
  shortId?: string;
  displayId: string;
  name?: string;
};

const defaultRender = ({ rawId, displayId, name }: IdentifierRenderProps) => {
  const display = name ?? displayId;
  // Show raw id as title when using name or short id
  const showTitle = rawId !== display;
  return showTitle ? <span title={rawId}>{display}</span> : <>{display}</>;
};

export const renderResponsiveShortId = ({
  rawId,
  shortId,
  displayId,
  name,
}: IdentifierRenderProps) => {
  const display = name ?? displayId;
  return (
    <>
      <span className="hidden sm:inline" title={rawId}>
        {display}
      </span>
      <span className="inline sm:hidden" title={rawId}>
        {name ?? shortId}
      </span>
    </>
  );
};

/**
 * @param showName - Show or hide the name, if available
 */
export default function IdentifierLabelWithButtons({
  className,
  type,
  id,
  isShort = false,
  showName = true,
  showButtons = true,
  render = defaultRender,
}: {
  className?: string;
  type: "Principal" | "Account" | "Neuron" | "Proposal";
  id: Principal | string | bigint | NeuronId;
  forceShowId?: boolean;
  showName?: boolean;
  isShort?: boolean;
  showButtons?: boolean;
  render?: (arg: IdentifierRenderProps) => JSX.Element;
}) {
  const { neuronName, principalName } = useNames();
  const rawId =
    typeof id === "object" && "_isPrincipal" in id
      ? id.toString()
      : typeof id === "bigint"
      ? id.toString()
      : typeof id === "object" && "id" in id
      ? id.id.toString()
      : id;

  let link: string;
  switch (type) {
    case "Principal":
      link = `https://dashboard.internetcomputer.org/account/${principalToAccountDefaultIdentifier(rawId)}`;
      break;
    case "Account":
      link = `https://dashboard.internetcomputer.org/account/${rawId}`;
      break;
    case "Neuron":
      link = `https://dashboard.internetcomputer.org/neuron/${rawId}`;
      break;
    case "Proposal":
      link = `https://dashboard.internetcomputer.org/proposal/${rawId}`;
      break;
  }

  let name: string;
  if (showName) {
    if (type === "Principal") name = principalName(rawId);
    if (type === "Neuron") name = neuronName(rawId);
  }

  let shortId: string;
  if (type === "Principal" || type === "Account") {
    if (type === "Principal") shortId = shortPrincipal(rawId);
    else if (type === "Account") shortId = shortAccount(rawId);
  }

  const displayId = isShort ? shortId ?? rawId : rawId;

  return (
    <span className={classNames("break-all leading-tight", className)}>
      {render({ rawId, shortId, displayId, name })}
      {showButtons && (
        <>
          <CopyButton text={rawId} title={`Copy ${type}`} />
          {!!link && (
            <ExternalLinkButton link={link} title="View on the Internet Copmputer Dashboard" />
          )}
        </>
      )}
    </span>
  );
}
