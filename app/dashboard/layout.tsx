import { ProgramProvider } from "@/lib/ProgramContext";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgramProvider>
      <DashboardShell>{children}</DashboardShell>
    </ProgramProvider>
  );
}
