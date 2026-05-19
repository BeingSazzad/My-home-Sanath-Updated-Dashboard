import { Bell, Car, House, UserStar } from "lucide-react";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";

export const sidebarItems = [
  {
    key: "",
    label: "Overview",
    path: "",
    icon: <RxDashboard size={20} />,
    public: true
  },

  {
    key: "revenues",
    label: "Revenues",
    path: "revenues",
    icon: <Car size={20} />,
    public: true
  },  
  {
    key: "users",
    label: "User Management",
    path: "users",
    icon: <FaRegCircleUser size={20} />,
    public: true
  },
  {
    key: "listings",
    label: "Listings",
    path: "listing",
    icon: <House size={20} />,
    public: true
  },
  {
    key: "enquiries",
    label: "Enquiries",
    path: "enquiries",
    icon: <Car size={20} />,
    public: true
  },
  {
    key: "transactions",
    label: "Transactions",
    path: "transactions",
    icon: <Car size={20} />,
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
    icon: <UserStar size={20} />,
    public: false
  },
  {
    key: "setting",
    label: "Settings",
    path: "setting",
    icon: <IoSettingsOutline size={20} />,
    public: true
  },
  // {
  //   key: "cms",
  //   label: "Content Manage",
  //   path: "cms",
  //   icon: <IoDocumentOutline size={20} />,
  //   children: [
  //     {
  //       key: "terms-condition",
  //       label: "Terms Condition",
  //       path: "terms-condition",
  //       icon: <AiOutlineSafetyCertificate size={20} />,
  //     },
  //     {
  //       key: "policy",
  //       label: "Privacy Policy",
  //       path: "policy",
  //       icon: <MdOutlinePrivacyTip size={20} />,
  //     },
  //     {
  //       key: "about",
  //       label: "About Us",
  //       path: "about",
  //       icon: <LuMessageCircleWarning size={20} />,
  //     },
  //     {
  //       key: "faq",
  //       label: "FAQ",
  //       path: "faq",
  //       icon: <FaQuestion size={20} />,
  //     },
  //   ],
  // },
];
