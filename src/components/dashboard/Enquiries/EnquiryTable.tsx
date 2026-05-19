import type { Enquiry } from "../../../types/enquiry";
import { Button } from "../../ui/button";


interface Props {
  data: Enquiry[];
  onView: (item: Enquiry) => void;
}

export const EnquiryTable = ({ data, onView }: Props) => {
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
          {data.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-3">{item.date}</td>

              <td className="p-3 flex items-center gap-3">
                <img
                  src={item.property.image}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{item.property.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.property.price}
                  </p>
                </div>
              </td>

              <td className="p-3">
                <p>{item.seeker.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.seeker.email}
                </p>
              </td>

              <td className="p-3">
                <p>{item.agent.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.agent.company}
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