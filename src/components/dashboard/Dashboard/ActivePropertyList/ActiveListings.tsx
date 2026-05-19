// components/dashboard/ActiveListings/ActiveListings.tsx
import { Building2, ChevronDown, Eye, ListFilter, MapPin, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "../../../../lib/utils";
import { useGetActiveListingsQuery } from "../../../../redux/features/dashboard/dashboardApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";

// ─── Types ───────────────────────────────────────────────
type StatusFilter = "All" | "Active" | "Under Offer" | "Sold" | "Inactive";
type StatusType   = "Active" | "Under Offer" | "Sold" | "Inactive";

interface PropertyListing {
  _id: string;
  name: string;
  views: number;
  location: string;
  agent: string;
  price: number;
  status: StatusType;
}

// ─── Config ──────────────────────────────────────────────
const statusConfig: Record<StatusType, { cls: string; dot: string }> = {
  Active:        { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  "Under Offer": { cls: "bg-amber-50 text-amber-700 border border-amber-200",       dot: "bg-amber-500"   },
  Sold:          { cls: "bg-blue-50 text-blue-700 border border-blue-200",           dot: "bg-blue-500"    },
  Inactive:      { cls: "bg-gray-100 text-gray-500 border border-gray-200",          dot: "bg-gray-400"    },
};

const ALL_FILTERS: StatusFilter[] = ["All", "Active", "Under Offer", "Sold", "Inactive"];

// ─── Fallback Data ────────────────────────────────────────
const FALLBACK: PropertyListing[] = [
  { _id: "1", name: "Modern Family Home",  views: 1247, location: "London",     agent: "Premium Estates Ltd", price: 485000, status: "Active"       },
  { _id: "2", name: "Luxury Apartment",    views: 892,  location: "Manchester", agent: "Johnson Properties",  price: 325000, status: "Active"       },
  { _id: "3", name: "Victorian Townhouse", views: 1563, location: "Edinburgh",  agent: "Heritage Homes",      price: 650000, status: "Under Offer"  },
  { _id: "4", name: "Contemporary Studio", views: 445,  location: "Birmingham", agent: "City Living Realty",  price: 195000, status: "Inactive"     },
];

// ─── Sub-components ───────────────────────────────────────
const StatusBadge = ({ status }: { status: StatusType }) => {
  const { cls, dot } = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
      {status}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────
const ActiveListings = () => {
  const { data } = useGetActiveListingsQuery({});
  const allListings: PropertyListing[] = data?.data ?? FALLBACK;

  const [selected, setSelected] = useState<StatusFilter>("All");
  const [open, setOpen]         = useState(false);
  const dropRef                 = useRef<HTMLDivElement>(null);

  const listings = selected === "All"
    ? allListings
    : allListings.filter((l) => l.status === selected);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 my-2">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Active Property Listings</h2>
          <p className="text-sm text-gray-400 mt-0.5">Recent high-performing properties</p>
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ListFilter className="w-4 h-4" />
            {selected === "All" ? "Filter" : selected}
            {selected !== "All" && (
              <span
                className="hover:bg-white/20 rounded-full p-0.5"
                onClick={(e) => { e.stopPropagation(); setSelected("All"); }}
              >
                <X className="w-3 h-3" />
              </span>
            )}
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-slate-100 shadow-lg z-20 py-1 overflow-hidden">
              {ALL_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSelected(s); setOpen(false); }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors",
                    selected === s
                      ? "bg-blue-50 text-blue-900 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      s === "All" ? "bg-slate-300" : statusConfig[s as StatusType].dot
                    )}
                  />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100">
            {["Property", "Location", "Agent", "Price", "Status"].map((h) => (
              <TableHead key={h} className="text-gray-400 font-semibold uppercase text-xs tracking-wider py-3">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {listings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                No listings match the selected filter.
              </TableCell>
            </TableRow>
          ) : (
            listings.map((listing) => (
              <TableRow key={listing._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                {/* Property */}
                <TableCell className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0B3C6D]/5 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-[#0B3C6D]/60" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{listing.name}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Eye className="w-3 h-3" />
                        {listing.views.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Location */}
                <TableCell className="py-5">
                  <span className="flex items-center gap-1.5 text-sm text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {listing.location}
                  </span>
                </TableCell>

                {/* Agent */}
                <TableCell className="py-5 text-sm text-gray-600">{listing.agent}</TableCell>

                {/* Price */}
                <TableCell className="py-5">
                  <span className="text-sm font-bold text-gray-900">
                    £{listing.price.toLocaleString()}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell className="py-5">
                  <StatusBadge status={listing.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActiveListings;