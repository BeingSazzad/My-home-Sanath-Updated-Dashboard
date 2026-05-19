// components/dashboard/ActiveListings/ActiveListings.tsx
import { Building2, Eye, ListFilter, MapPin } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { useGetActiveListingsQuery } from "../../../../redux/features/dashboard/dashboardApi";
import { Button } from "../../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
// import { useGetActiveListingsQuery } from "../../../redux/features/dashboard/dashboardApi";

// ─── Types ───────────────────────────────────────────────
type StatusType = "Active" | "Under Offer" | "Sold" | "Inactive";

interface PropertyListing {
  _id: string;
  name: string;
  views: number;
  location: string;
  agent: string;
  price: number;
  status: StatusType;
}

const statusConfig: Record<StatusType, string> = {
  Active: "bg-blue-50 text-blue-600 border border-blue-200",
  "Under Offer": "bg-purple-50 text-purple-600 border border-purple-200",
  Sold: "bg-green-50 text-green-700 border border-green-200",
  Inactive: "bg-gray-100 text-gray-500 border border-gray-200",
};


// ─── Fallback Data ────────────────────────────────────────
const FALLBACK: PropertyListing[] = [
  { _id: "1", name: "Modern Family Home",  views: 1247, location: "London",     agent: "Premium Estates Ltd", price: 485000, status: "Active"      },
  { _id: "2", name: "Luxury Apartment",    views: 892,  location: "Manchester", agent: "Johnson Properties",  price: 325000, status: "Active"      },
  { _id: "3", name: "Victorian Townhouse", views: 1563, location: "Edinburgh",  agent: "Heritage Homes",      price: 650000, status: "Under Offer" },
  { _id: "4", name: "Contemporary Studio", views: 445,  location: "Birmingham", agent: "City Living Realty",  price: 195000, status: "Active"      },
];

// ─── Sub-components ───────────────────────────────────────
const SkeletonRow = () => (
  <TableRow>
    {Array.from({ length: 5 }).map((_, i) => (
      <TableCell key={i}>
        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
      </TableCell>
    ))}
  </TableRow>
);

const Badge = ({ label, className }: { label: string; className: string }) => (
  <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium", className)}>
    {label}
  </span>
);

// ─── Main Component ───────────────────────────────────────
const ActiveListings = () => {
  const { data, isLoading } = useGetActiveListingsQuery({});
  const listings: PropertyListing[] = FALLBACK ?? data?.data;    


  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 my-2">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Active Property Listings</h2>
          <p className="text-sm text-gray-400 mt-0.5">Recent high-performing properties</p>
        </div>

        <Button variant="default" size="lg"         
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium  rounded-xl transition-colors "
          )}
        >
          <ListFilter className="w-4 h-4" />
          Filter
        </Button>
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
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
          ) : listings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                No listings match the selected filters.
              </TableCell>
            </TableRow>
          ) : (
            listings.map((listing) => (
              <TableRow key={listing._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                {/* Property */}
                <TableCell className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-400" />
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
                  <Badge label={listing.status} className={statusConfig[listing.status]} />
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