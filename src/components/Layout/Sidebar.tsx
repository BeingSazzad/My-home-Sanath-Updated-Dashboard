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
    <aside className="bg-white border-r border-slate-100 w-full h-screen">
      <div className="h-full flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between py-5 px-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <img className="h-8 w-auto shrink-0" src="/logo.png" alt="Logo" />
            <span className="text-base font-bold text-slate-800 tracking-tight">
              MyHome
            </span>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 pr-3 pl-0 py-5">
          <nav className="space-y-1.5">
            {filteredSidebarItems?.map((item) => {
              const itemPath = `/${item.path}`;
              const isItemActive = isActive(itemPath);

              return (
                <Link
                  key={item.key}
                  to={itemPath}
                  className={cn(
                    "relative flex items-center gap-3 pl-6 pr-4 py-2.5 min-h-11 transition-all rounded-r-xl rounded-l-none font-normal text-base",
                    isItemActive
                      ? "bg-[#0B3C6D]/8 text-[#0B3C6D]! font-semibold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  )}
                >
                  {isItemActive && (
                    <div className="absolute left-0 top-[20%] bottom-[20%] w-1 rounded-r bg-[#0B3C6D]" />
                  )}
                  <span className={cn("shrink-0", isItemActive ? "text-[#0B3C6D]" : "text-slate-400")}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Logout */}
        <div className="border-t border-slate-100 p-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full gap-3 justify-start pl-6 py-2.5 h-11 text-slate-500 hover:text-red-600 hover:bg-red-50/50 transition-all font-medium rounded-xl border-0 shadow-none"
          >
            <FiLogOut className="h-5 w-5 shrink-0" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}