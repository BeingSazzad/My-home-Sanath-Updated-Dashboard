import React, { useState, useMemo } from "react";
import { usersData } from "../../../data/usersData";
import UserStatCards from "./UserStatCards";
import UserToolbar from "./UserToolbar";
import UserTable from "./UserTable";
import Agents from "../Agents/Agents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

const UserManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const filtered = useMemo(() =>
    usersData.filter((u) => {
      const q = search.toLowerCase();
      const matchQ = !q || u.name.toLowerCase().includes(q)
        || u.email.toLowerCase().includes(q)
        || u.location.toLowerCase().includes(q);
      const matchS = !statusFilter || u.status === statusFilter;
      const matchL = !locationFilter || u.location === locationFilter;
      return matchQ && matchS && matchL;
    }), [search, statusFilter, locationFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="title">User Management</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage all registered property seekers and agents</p>
      </div>

      <Tabs defaultValue="seekers" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-fit flex gap-1 mb-6 border border-slate-200/50">
          <TabsTrigger 
            value="seekers" 
            className="px-6 py-2 text-sm font-medium rounded-lg text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm cursor-pointer transition-all"
          >
            Property Seekers
          </TabsTrigger>
          <TabsTrigger 
            value="agents" 
            className="px-6 py-2 text-sm font-medium rounded-lg text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm cursor-pointer transition-all"
          >
            Agents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seekers" className="space-y-6 outline-none focus:outline-none">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Property Seekers</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage property seeker profiles and platform actions</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-50 cursor-pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export
            </button>
          </div>

          <UserStatCards />
          <UserToolbar
            search={search}
            status={statusFilter}
            location={locationFilter}
            onSearch={(val) => { setSearch(val); }}
            onStatus={(val) => { setStatusFilter(val); }}
            onLocation={(val) => { setLocationFilter(val); }}
          />
          <UserTable users={filtered} total={usersData.length} />
        </TabsContent>

        <TabsContent value="agents" className="outline-none focus:outline-none">
          <Agents isTabbed={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;