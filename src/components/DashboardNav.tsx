"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, LayoutDashboard, FolderOpen, LogOut, Plus } from "lucide-react";

interface Props {
  user: { name: string | null; email: string };
}

export default function DashboardNav({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const links = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/projects", icon: FolderOpen, label: "Projets" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col"
      style={{ background: "#0a0a12", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        <span className="text-xl font-black text-white">Flowo</span>
      </div>

      {/* New Project Button */}
      <div className="p-4">
        <Link href="/dashboard/projects/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
          <Plus className="w-4 h-4" />
          Nouveau projet
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              style={active ? { background: "rgba(99,102,241,0.2)", color: "#a5b4fc" } : {}}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
            {(user.name || user.email)[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-medium text-white truncate">{user.name || "Mon compte"}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
