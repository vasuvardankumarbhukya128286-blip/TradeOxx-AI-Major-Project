"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Menu, Command, LogOut, User as UserIcon, CheckCircle2 } from "lucide-react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/components/ui/utils";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export function TopNav() {
  const router = useRouter();
  const { setCommandPaletteOpen, sidebarExpanded, toggleSidebar } = useWorkspaceStore();
  const { user, logout } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header 
      className={cn(
        "h-16 fixed top-0 right-0 z-30 transition-all duration-300 border-b border-white/5 bg-[#02050E]/80 backdrop-blur-xl flex items-center justify-between px-6",
        sidebarExpanded ? "w-[calc(100%-16rem)]" : "w-[calc(100%-5rem)]"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-brand-textSecondary hover:text-white"
        >
          <Menu size={20} />
        </button>

        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-brand-textMuted w-full max-w-md transition-all group"
        >
          <Search size={16} className="group-hover:text-white transition-colors" />
          <span className="text-sm flex-1 text-left group-hover:text-white transition-colors">Search anything...</span>
          <div className="flex items-center gap-1 text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-brand-textSecondary">
            <Command size={10} /> K
          </div>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* AI Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20">
          <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></div>
          <span className="text-xs font-bold text-brand-cyan">AI Online</span>
        </div>

        {/* Notifications */}
        <NotificationCenter />

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 pl-2 py-1 pr-2 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-xs font-bold text-white border border-white/10 shadow-sm">
              {(user?.username?.[0] || user?.profile?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">
                {user?.username || user?.profile?.displayName || "Trader"}
              </span>
              <span className="text-[10px] text-brand-textMuted leading-tight truncate max-w-[120px]">
                {user?.email || "Account"}
              </span>
            </div>
          </button>

          {profileOpen && (
            <div 
              className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#070C1E] border border-white/10 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
              onMouseLeave={() => setProfileOpen(false)}
            >
              <div className="px-3 py-2 border-b border-white/5 mb-2">
                <p className="text-xs font-medium text-brand-textMuted">Signed in as</p>
                <p className="text-sm font-bold text-white truncate">{user?.username || "Trader"}</p>
                <p className="text-xs text-brand-textSecondary truncate">{user?.email || "No email provided"}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-left"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
