import DashboardShell from "./_components/DashboardShell";

// Auth-dependent — opt out of static prerender.
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
