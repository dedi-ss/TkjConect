import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { RecentAttendance } from "@/components/dashboard/recent-attendance";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/page-header";
import { statCards } from "@/lib/data";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Selamat datang di panel admin EduTrack." />
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} card={card} />
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:gap-8 lg:grid-cols-3">
        <AttendanceChart />
        <RecentAttendance />
      </div>
    </>
  );
}
