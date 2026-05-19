import Cookies from "js-cookie";
import { FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sidebarItems } from "../../lib/SidebarItems";
import { cn } from "../../lib/utils";
import { useGetProfileQuery } from "../../redux/features/user/userApi";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

// ───────────────── Children ───────────────────────────────
// Types
// interface SidebarItemChild {
//   path: string;
//   icon?: React.ReactNode;
//   label: string;
// }


// ────────────────────────────────────────────────
export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const { data: profileData } = useGetProfileQuery({});

  const filteredSidebarItems = sidebarItems?.filter((item) =>
    profileData?.role !== "ADMIN" ? true : item?.public
  );

  const handleLogout = () => {
    Cookies.remove("accessToken");
    navigate("/login");
  };

  return (
    <aside className="bg-white border-r border-neutral-200 w-full h-screen">
      <div className="h-full flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col py-3 items-center border-b border-neutral-200 px-4">
          <img className="w-20 mx-auto" src="/logo.png" alt="" />
          <span className="text-lg font-semibold text-neutral-900">
            Admin Dashboard
          </span>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {filteredSidebarItems?.map((item) => {
              const itemPath = `/${item.path}`;
              const isItemActive = isActive(itemPath);

              return (
                <Link
                  key={item.key}
                  to={itemPath}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 min-h-11 transition-all border",
                    isItemActive
                      ? "bg-primary text-white! border-primary shadow-sm font-medium"
                      : "border border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Logout */}
        <div className="border-t border-neutral-200 p-3">
          <Button
            onClick={handleLogout}
            className="w-full gap-3 bg-primary hover:bg-primary/95 text-white transition-all shadow-sm font-medium"
          >
            <FiLogOut className="h-5 w-5" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}