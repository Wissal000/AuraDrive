import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Car,
  Users,
  Plus,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-layout min-h-screen w-full bg-black text-white flex">
      {/* Sidebar */}
      <aside
        className={`
          admin-sidebar
          ${collapsed ? "w-20" : "w-64"}
          shrink-0
          border-r border-white/10
          bg-black/60 backdrop-blur-xl
          transition-width duration-300
          flex flex-col
        `}
      >
        {/* Logo / Title */}
        <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex flex-col leading-tight">
              <span className="text-[14px] uppercase tracking-widest text-zinc-500">
                Back office
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Aura<span className="text-zinc-400">Drive</span>
              </h2>
            </div>
          ) : (
            <span className="text-xl font-semibold">A</span>
          )}

          <button
            className="text-zinc-400 hover:text-white"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-1 py-4 space-y-1 text-sm">
          <NavItem
            to="/admin"
            label="Dashboard"
            Icon={LayoutDashboard}
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/allBookings"
            label="Bookings"
            Icon={CalendarCheck}
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/addCar"
            label="Add Car"
            Icon={Plus}
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/cars"
            label="All Cars"
            Icon={Car}
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/users"
            label="Users"
            Icon={Users}
            collapsed={collapsed}
          />
        </nav>
      </aside>

      {/* Main content */}
      <div className="admin-main flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="admin-header h-16 border-b border-white/10 bg-black/60 backdrop-blur-xl flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {!collapsed && (
              <img src="/logo.png" alt="logo" className="h-30 w-auto" />
            )}
            {collapsed && (
              <img src="/logo.png" alt="logo" className="h-30 w-auto" />
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Admin</span>
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content flex-1 min-h-0 bg-black overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, label, Icon, collapsed }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition
        ${isActive ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/7"}
        `
      }
    >
      {({ isActive }) => (
        <>
          {/* active indicator */}
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r
              ${isActive ? "bg-white" : "bg-transparent"}
            `}
          />
          <Icon
            className={`w-5 h-5 ${isActive ? "text-white" : "text-[#c14416] group-hover:text-white/50"}`}
          />
          {!collapsed && <span className="text-sm font-medium">{label}</span>}
        </>
      )}
    </NavLink>
  );
}
