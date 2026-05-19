import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";

import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "../../ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const TITLE_MAX = 50;
const MSG_MAX = 200;

export function CreateNotificationModal({ open, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("");
  const [category, setCategory] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !message || !audience) {
      toast.error("Please fill in required fields.", { id: "create-notification" });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 800));
      toast.success("Notification sent successfully!");
      onCreated();
      handleClose();
    } catch (err) {
      console.error("CreateNotificationModal error:", err);
      toast.error("Unexpected error occurred", { id: "create-notification" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle(""); setMessage(""); setAudience("");
    setCategory(""); setScheduleDate(""); setScheduleTime("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Push Notification</DialogTitle>
          <DialogDescription>Send a notification to your users</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="notif-title">Notification Title</Label>
            <Input
              id="notif-title"
              placeholder="Enter notification title"
              maxLength={TITLE_MAX}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className="text-xs text-gray-400">{title.length}/{TITLE_MAX} characters</p>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="notif-msg">Message</Label>
            <Textarea
              id="notif-msg"
              placeholder="Enter your notification message"
              maxLength={MSG_MAX}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="text-xs text-gray-400">{message.length}/{MSG_MAX} characters</p>
          </div>

          {/* Audience + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Target Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="agents">Agents</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="listing">Listing</SelectItem>
                  <SelectItem value="market">Market Update</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="schedule-date">Schedule Date (Optional)</Label>
              <Input
                id="schedule-date"
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="schedule-time">Schedule Time (Optional)</Label>
              <Input
                id="schedule-time"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2 bg-blue-900 hover:bg-blue-800">
              <Send size={15} />
              {loading ? "Sending..." : "Send Now"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}