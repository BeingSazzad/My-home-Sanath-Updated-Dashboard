import { Bell, Calendar, Eye, Plus, Trash2, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

import { toast } from "sonner";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";


import { AudienceBadge } from "./Audiencebadge";


import { pushNotifications } from "../../../data/pushNotifications";
import { Button } from "../../ui/button";
import { CreateNotificationModal } from "./Createnotificationmodal";
import { NotificationStatusBadge } from "./NotificationStatusBadge";

const PAGE_SIZE = 4;

export default function PushNotificationsPage() {
  const [data, setData] = useState<any[]>(pushNotifications);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paginated = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted.");
  };

  const handleCreated = () => {
    toast.success("Notification created!");
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="title">Push Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">
            Send targeted push notifications to users and agents
          </p>
        </div>
        <Button
          className="gap-2 bg-[#0B3C6D] hover:bg-[#0B3C6D]/95 text-white"
          onClick={() => setModalOpen(true)}
        >
          <Plus size={16} />
          Create Notification
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">All Notifications</h2>
          <p className="text-sm text-gray-500">{data.length} notifications created</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="text-xs uppercase tracking-wider text-gray-500">
              <TableHead>Notification</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((notif) => (
              <TableRow key={notif.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Bell size={16} className="text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{notif.title}</div>
                      <div className="text-xs text-gray-500 max-w-[260px] truncate">{notif.message}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <AudienceBadge audience={notif.audience} />
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-sm text-gray-700">
                    <Users size={13} className="text-gray-400" />
                    {notif.recipients.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  {notif.opened != null ? (
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Eye size={12} className="text-gray-400" /> {notif.opened} opened
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} className="text-gray-400" /> {notif.clicked} clicked
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {notif.date ? (
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-gray-400" />
                      {notif.date}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar size={13} />
                      Not scheduled
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <NotificationStatusBadge status={notif.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                      <Eye size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-600"
                      onClick={() => handleDelete(notif.id)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <CreateNotificationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}