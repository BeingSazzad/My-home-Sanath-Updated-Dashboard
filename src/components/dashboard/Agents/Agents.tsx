import React, { useState, useMemo } from "react";
import { agentsData } from "../../../data/agentsData";
import AgentStatCards from "./AgentStatCards";
import AgentToolbar from "./AgentToolbar";
import AgentTable from "./AgentTable";
import { Button } from "../../ui/button";
import { Download, Plus } from "lucide-react";

interface AgentsProps {
  isTabbed?: boolean;
}

const Agents: React.FC<AgentsProps> = ({ isTabbed = false }) => {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return agentsData.filter(a => {
      const matchSearch = !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.agency.toLowerCase().includes(q);
      const matchPlan = !planFilter || a.plan === planFilter;
      const matchStatus = !statusFilter || a.status === statusFilter;
      return matchSearch && matchPlan && matchStatus;
    });
  }, [search, planFilter, statusFilter]);

  return (
    <div className="">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
       <div>
          <h1 className={isTabbed ? "text-xl font-bold text-slate-900" : "title"}>Agents</h1>
          <p className={isTabbed ? "text-xs text-slate-400 mt-0.5" : "text-sm text-gray-400 mt-0.5"}>Manage real estate agents and their accounts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="flex items-center gap-2  rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-50">
            <Download />
            Export
          </Button>
          <Button className="flex items-center gap-2  bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-700">           
            <Plus /> Add Agent
          </Button>
        </div>
      </div>

      <AgentStatCards agents={agentsData} />
      <AgentToolbar
        search={search}
        plan={planFilter}
        status={statusFilter}
        onSearch={setSearch}
        onPlan={setPlanFilter}
        onStatus={setStatusFilter}
      />
      <AgentTable agents={filtered} total={agentsData.length} />
    </div>
  );
};

export default Agents;