import { useState } from "react";
import type { Enquiry } from "../../../types/enquiry";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { enquiries } from "../../../data/enquiries";
import { EnquiryTable } from "./EnquiryTable";
import { EnquiryModal } from "./EnquiryModal";
import { Inbox, Calendar, BarChart3 } from "lucide-react";


const StatsCard = ({ title, value, icon: Icon, iconBg, iconColor }: any) => {
    return (
        <Card className="rounded-2xl border border-gray-150/70 shadow-sm bg-white hover:shadow-md transition-all duration-300">
        <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-800">{value}</span>
                </div>
              </div>
            </div>
        </CardContent>
        </Card>
    );
};


export default function EnquiriesPage() {
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [open, setOpen] = useState(false);

  const handleView = (item: Enquiry) => {
    setSelected(item);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="title">Leads & Enquiries</h1>
        <Button>Export</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          title="Total Enquiries"
          value="1,247"
          icon={Inbox}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="New This Week"
          value="87"
          icon={Calendar}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="This Month"
          value="342"
          icon={BarChart3}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Search */}
      <Input placeholder="Search by property, user, or agent..." />

      {/* Table */}
      <EnquiryTable data={enquiries} onView={handleView} />

      {/* Modal */}
      <EnquiryModal
        open={open}
        onClose={() => setOpen(false)}
        data={selected || undefined}
      />
    </div>
  );
}