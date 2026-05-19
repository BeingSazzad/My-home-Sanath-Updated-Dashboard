import { 
  LayoutDashboard, 
  DollarSign, 
  Users, 
  Home, 
  MessageSquare, 
  CreditCard, 
  Bell, 
  UserCheck, 
  Settings 
} from "lucide-react";

export const sidebarItems = [
  {
    key: "",
    label: "Overview",
    path: "",
    icon: <LayoutDashboard size={20} />,
    public: true
  },
  {
    key: "users",
    label: "User Management",
    path: "users",
    icon: <Users size={20} />,
    public: true
  },
  {
    key: "listings",
    label: "Listings",
    path: "listing",
    icon: <Home size={20} />,
    public: true
  },
  {
    key: "enquiries",
    label: "Enquiries",
    path: "enquiries",
    icon: <MessageSquare size={20} />,
    public: true
  },
  {
    key: "transactions",
    label: "Transactions",
    path: "transactions",
    icon: <CreditCard size={20} />,
    public: true
  },
  {
    key: "revenues",
    label: "Revenues",
    path: "revenues",
    icon: <DollarSign size={20} />,
    public: true
  },  
  {
    key: "push-notifications",
    label: "Push Notifications",
    path: "push-notifications",
    icon: <Bell size={20} />,
    public: true
  },
  {
    key: "admins",
    label: "Admin",
    path: "admins",
    icon: <UserCheck size={20} />,
    public: false
  },
  {
    key: "setting",
    label: "Settings",
    path: "setting",
    icon: <Settings size={20} />,
    public: true
  }
];
