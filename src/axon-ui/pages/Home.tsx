import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import AllAxons from "../components/Axons/AllAxons";
import MyAxons from "../components/Axons/MyAxons";
import Panel from "../components/Containers/Panel";
import { useGlobalContext } from "../components/Store/Store";

export default function Home() {
  const {
    state: { isAuthed },
  } = useGlobalContext();

  return (
    <div className="flex flex-col gap-8 pt-8" suppressHydrationWarning>
      <Panel className="p-8 text-xl custom-panel">
        <div className="flex flex-col gap-4 items-start md:flex-row md:justify-between">
          <span>
            Service for Axon canisters management
          </span>
          <Link to="/axon/new" className="rounded-md btn-cta px-4 py-2 text-xl inline-flex gap-2 items-center whitespace-nowrap">
              Create new Governance <FaArrowRight />
          </Link>
        </div>
      </Panel>

      {isAuthed && <MyAxons />}

      <AllAxons />
    </div>
  );
}
