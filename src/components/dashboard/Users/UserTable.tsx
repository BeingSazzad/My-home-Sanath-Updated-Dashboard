import React from "react";
    
import UserTableRow from "./UserTableRow";
import type { User } from "../../../data/usersData";

const HEADERS = ["USER","CONTACT","LOCATION","SAVED","ENQUIRIES","JOIN DATE","LAST ACTIVE","STATUS","ACTIONS"];

interface Props { users: User[]; total: number; }

const UserTable: React.FC<Props> = ({ users, total }) => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100">
      <h2 className="text-[15px] font-medium text-gray-900">All Users</h2>
      <p className="text-xs text-gray-400 mt-0.5">{users.length} users found</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50/70 border-b border-gray-100">
            {HEADERS.map((h) => (
              <th key={h} className="text-left text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-4 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => <UserTableRow key={u.id} user={u} index={i} />)}
        </tbody>
      </table>
    </div>
    <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100">
      <span className="text-sm text-gray-400">Showing {users.length} of {total} users</span>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Previous</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-sm bg-blue-600 text-white">1</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-500 hover:bg-gray-100">2</button>
        <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Next</button>
      </div>
    </div>
  </div>
);

export default UserTable;