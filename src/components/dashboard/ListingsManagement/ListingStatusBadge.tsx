import React from "react";
import type { ListingStatus } from "../../../data/listingsData";

const cfg: Record<ListingStatus, { cls: string; label: string }> = {
  active:   { cls:"bg-green-50 text-green-700",  label:"Active"   },
  pending:  { cls:"bg-yellow-50 text-yellow-700", label:"Pending"  },
  sold:     { cls:"bg-blue-50 text-blue-700",     label:"Sold"     },
  rejected: { cls:"bg-red-50 text-red-700",       label:"Rejected" },
};

const ListingStatusBadge: React.FC<{ status: ListingStatus }> = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg[status].cls}`}>
    {cfg[status].label}
  </span>
);

export default ListingStatusBadge;