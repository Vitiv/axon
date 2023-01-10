import { Link } from "react-router-dom";
import React from "react";
import { useTopAxons } from "../../lib/hooks/Axons/useTopAxons";
import { formatNumber, pluralize } from "../../lib/utils";
import { RefreshButton } from "../Buttons/RefreshButton";
import Panel from "../Containers/Panel";
import BalanceLabel from "../Labels/BalanceLabel";
import ResponseError from "../Labels/ResponseError";

export default function AllAxons() {
  const { data, isSuccess, isFetching, refetch, error } = useTopAxons();

  return (
    <Panel className="custom-panel">
      <div className="flex gap-2 items-center mb-2">
        <h2 className="text-xl font-bold">All Axons</h2>
        <RefreshButton
          isFetching={isFetching}
          onClick={refetch}
          title="Refresh All Axons"
        />
      </div>
      <div>
        {error && <ResponseError>{error}</ResponseError>}
        {data ? (
          <div className="grid xs:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 p-4">
            {data.map(({ id, totalStake, tokenHolders, name }) => (
              <Link key={id.toString()} to={`/axon/${id}`} className="p-4 bg-black text-xl text-white h-48 hover:shadow-xl transition">
                <>
                  <h3 className="text-2xl font-bold">{name}</h3>
                  <label className="block">Axon {id.toString()}</label>
                  <BalanceLabel value={totalStake} />
                  <label className="block">
                    {formatNumber(tokenHolders)}{" "}
                    {pluralize("Holder", Number(tokenHolders))}
                  </label>
                </>
              </Link>
            ))}
          </div>
        ) : (
          isSuccess && (
            <div className="h-40 flex flex-col items-center justify-center">
              <p className="text-5xl">🤷‍♂️</p>
              <p className="py-4 text-gray-500 text-sm">No Axons found</p>
            </div>
          )
        )}
      </div>
    </Panel>
  );
}
