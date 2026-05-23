import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardNav from "@/components/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex" style={{ background: "#050508" }}>
      <DashboardNav user={{ name: user.name, email: user.email }} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
