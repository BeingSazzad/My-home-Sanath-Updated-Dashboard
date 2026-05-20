import React, { useState, useMemo } from "react";
import AgentStatCards from "./AgentStatCards";
import AgentToolbar from "./AgentToolbar";
import AgentTable from "./AgentTable";
import { useGetUsersQuery } from "../../../redux/features/user/userApi";

interface AgentsProps {
  isTabbed?: boolean;
}

const Agents: React.FC<AgentsProps> = ({ isTabbed = false }) => {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: allData } = useGetUsersQuery({
    page: 1,
    limit: 10,
    searchTerm: search,
    role: "AGENT",
    status: statusFilter,
    plan: planFilter,
  });

  console.log(allData,"AGENTS DATA");

  const filtered = useMemo(() => {
    return allData?.data || [];
  }, [allData]);

  return (
    <div className="">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
       <div>
          <h1 className={isTabbed ? "text-xl font-bold text-slate-900" : "title"}>Agents</h1>
          <p className={isTabbed ? "text-xs text-slate-400 mt-0.5" : "text-sm text-gray-400 mt-0.5"}>Manage real estate agents and their accounts</p>
        </div>
        {/* <div >
          <Button className="bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-700">           
            <Plus /> Add Agent
          </Button>
        </div> */}
      </div>

      <AgentStatCards agents={filtered} />
      <AgentToolbar
        search={search}
        plan={planFilter}
        status={statusFilter}
        onSearch={setSearch}
        onPlan={setPlanFilter}
        onStatus={setStatusFilter}
      />
      <AgentTable agents={filtered} total={allData?.meta?.total || 0} />
    </div>
  );
};

export default Agents;