import type { Enquiry } from "../../../types/enquiry";
import { Button } from "../../ui/button";


import { imageUrl } from "../../../redux/base/baseAPI";

interface Props {
  data: any[];
  onView: (item: any) => void;
  isLoading?: boolean;
}

export const EnquiryTable = ({ data, onView, isLoading }: Props) => {
  return (
    <div className="border rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Property</th>
            <th className="p-3 text-left">Property Seeker</th>
            <th className="p-3 text-left">Agent</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-500">Loading enquiries...</td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-500">No enquiries found</td>
            </tr>
          ) : data.map((item) => (
            <tr key={item._id} className="border-t hover:bg-gray-50">
              <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>

              <td className="p-3 flex items-center gap-3">
                {item.listingId?.photos?.[0] ? (
                  <img
                    src={`${imageUrl}${item.listingId.photos[0]}`}
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image'; }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center border">No img</div>
                )}
                <div>
                  <p className="font-medium">{item.listingId?.title || 'Unknown Property'}</p>
                  <p className="text-xs text-muted-foreground">
                    £{item.listingId?.askingPrice?.toLocaleString() || 0}
                  </p>
                </div>
              </td>

              <td className="p-3">
                <p>{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.email}
                </p>
              </td>

              <td className="p-3">
                <p>{item.listingId?.agentId?.name || 'Unknown'}</p>
                <p className="text-xs text-muted-foreground">
                  {item.listingId?.agentId?.agencyName || 'N/A'}
                </p>
              </td>

              <td className="p-3 text-right">
                <Button size="sm" onClick={() => onView(item)}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};