import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
  Car,
  LayoutDashboard,
  Calendar,
  Users,
  Plus,
  Menu,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-dvh overflow-hidden bg-black text-white">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-white/10 bg-zinc-950 transition-[width] duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-4 shrink-0">
          {!collapsed ? (
            <span className="text-lg font-semibold">
              Aura<span className="text-zinc-400">Drive</span>
            </span>
          ) : (
            <span className="text-lg font-semibold">A</span>
          )}
        </div>

        <Separator className="bg-white/10" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          <Item
            to="/admin"
            icon={LayoutDashboard}
            label="Dashboard"
            collapsed={collapsed}
            end
          />

          <Item
            to="/admin/allBookings"
            icon={Calendar}
            label="Bookings"
            collapsed={collapsed}
          />

          <Item
            to="/admin/addCar"
            icon={Plus}
            label="Add Car"
            collapsed={collapsed}
          />

          <Item
            to="/admin/cars"
            icon={Car}
            label="Cars"
            collapsed={collapsed}
          />

          <Item
            to="/admin/users"
            icon={Users}
            label="Users"
            collapsed={collapsed}
          />
          <Item
            to="/admin/getAllMaintenance"
            icon={Wrench}
            label="Maintenance"
            collapsed={collapsed}
          />
        </nav>

        <Separator className="bg-white/10" />

        {/* Footer user */}
        <div className="h-20 flex items-center px-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#C8A78E]/20 flex items-center justify-center text-sm font-semibold text-[#C8A78E]">
              A
            </div>

            {!collapsed && (
              <div className="leading-tight">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-zinc-400">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 shrink-0 border-b border-white/10 bg-zinc-950 flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <img src="/logo.png" alt="Logo" className="h-35 object-contain" />

          <div className="text-sm text-zinc-400">BACK OFFICE</div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Sidebar item */
/* ---------------------------------- */

function Item({ to, icon: Icon, label, collapsed, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `
        flex items-center h-10 rounded-md px-3 gap-3 text-sm
        transition-colors
        focus:outline-none focus:ring-1 focus:ring-white/20
        ${
          isActive
            ? "bg-white/10 text-white"
            : "text-zinc-400 hover:bg-white/5 hover:text-white"
        }
      `
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}
