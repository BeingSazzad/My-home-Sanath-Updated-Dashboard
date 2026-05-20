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
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: allData, isLoading, isError } = useGetUsersQuery({
    page,
    limit,
    searchTerm: search || undefined,
    role: "AGENT",
    status: statusFilter || undefined,
    plan: planFilter || undefined,
  });

  const filtered = useMemo(() => {
    return allData?.data || [];
  }, [allData]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatus = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handlePlan = (val: string) => {
    setPlanFilter(val);
    setPage(1);
  };

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
        onSearch={handleSearch}
        onPlan={handlePlan}
        onStatus={handleStatus}
      />
      <AgentTable
        agents={filtered}
        total={allData?.meta?.total || 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default Agents;