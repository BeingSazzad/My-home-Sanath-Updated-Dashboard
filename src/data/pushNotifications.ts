export type NotificationStatus = "sent" | "scheduled" | "draft";
export type AudienceType = "users" | "agents" | "all";

export interface Notification {
  id: string;
  title: string;
  message: string;
  audience: AudienceType;
  recipients: number;
  opened?: number;
  clicked?: number;
  date: string | null;
  status: NotificationStatus;
}

export const pushNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "New Properties in Your Area",
    message: "Check out 15 new properties that match your saved search criteria.",
    audience: "users",
    recipients: 1250,
    opened: 892,
    clicked: 234,
    date: "2024-03-16",
    status: "sent",
  },
  {
    id: "notif-2",
    title: "Featured Listing Expiring Soon",
    message: "Your featured listing expires in 3 days. Renew now to stay visible.",
    audience: "agents",
    recipients: 45,
    opened: 38,
    clicked: 22,
    date: "2024-03-15",
    status: "sent",
  },
  {
    id: "notif-3",
    title: "Spring Property Market Update",
    message: "See the latest trends and insights for Spring 2024 property market.",
    audience: "all",
    recipients: 4020,
    date: "2024-03-20",
    status: "scheduled",
  },
  {
    id: "notif-4",
    title: "Price Drop Alert",
    message: "A property you saved has reduced its price by £25,000.",
    audience: "users",
    recipients: 128,
    date: null,
    status: "draft",
  },
];