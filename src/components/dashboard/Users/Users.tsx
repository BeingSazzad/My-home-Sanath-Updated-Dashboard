import React, { useState, useMemo } from "react";
import UserStatCards from "./UserStatCards";
import UserToolbar from "./UserToolbar";
import UserTable from "./UserTable";
import Agents from "../Agents/Agents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { useGetUsersQuery } from "../../../redux/features/user/userApi";

const UserManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("USER");
  const [plan, setPlan] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: allData } = useGetUsersQuery({
    page: 1,
    limit: 10,
    searchTerm: search,
    role: tab,
    status: statusFilter,
    plan: plan,
  });

    console.log(allData,"USERS DATA");

  const filtered = useMemo(() =>
    allData?.data || [], [allData]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="title">User Management</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage all registered property seekers and agents</p>
      </div>

      <Tabs 
        defaultValue="USER" 
        className="w-full"
        onValueChange={(value) => setTab(value)}
      >
        <TabsList className="bg-slate-100 p-1 rounded-xl w-fit flex gap-1 mb-6 border border-slate-200/50">
          <TabsTrigger 
            value="USER" 
            className="px-6 py-2 text-sm font-medium rounded-lg text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm cursor-pointer transition-all"
          >
            Property Seekers
          </TabsTrigger>
          <TabsTrigger 
            value="AGENT" 
            className="px-6 py-2 text-sm font-medium rounded-lg text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm cursor-pointer transition-all"
          >
            Agents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="USER" className="space-y-6 outline-none focus:outline-none">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Property Seekers</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage property seeker profiles and platform actions</p>
            </div>
          </div>

          <UserStatCards />
          <UserToolbar
            search={search}
            status={statusFilter}
            onSearch={(val) => { setSearch(val); }}
            onStatus={(val) => { setStatusFilter(val); }}
          />
          <UserTable users={filtered} total={allData?.meta?.total || 0} />
        </TabsContent>

        <TabsContent value="AGENT" className="outline-none focus:outline-none">
          <Agents isTabbed={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;