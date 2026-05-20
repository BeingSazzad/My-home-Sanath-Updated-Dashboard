import React from "react";

const cfg: Record<string, { cls: string; label: string }> = {
  PUBLISHED: { cls:"bg-green-50 text-green-700",  label:"Published" },
  PENDING_APPROVAL: { cls:"bg-yellow-50 text-yellow-700", label:"Pending" },
  SOLD: { cls:"bg-blue-50 text-blue-700", label:"Sold" },
  REJECTED: { cls:"bg-red-50 text-red-700", label:"Rejected" },
  DRAFT: { cls:"bg-gray-50 text-gray-700", label:"Draft" },
  active:   { cls:"bg-green-50 text-green-700",  label:"Active"   },
  pending:  { cls:"bg-yellow-50 text-yellow-700", label:"Pending"  },
  sold:     { cls:"bg-blue-50 text-blue-700",     label:"Sold"     },
  rejected: { cls:"bg-red-50 text-red-700",       label:"Rejected" },
};

const ListingStatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg[status]?.cls || "bg-gray-50 text-gray-700"}`}>
    {cfg[status]?.label || status}
  </span>
);

export default ListingStatusBadge;