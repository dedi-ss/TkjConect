import { PageHeader } from "@/components/page-header";
import { TeacherAttendanceClient } from "@/components/dashboard/absensi/guru/teacher-attendance-client";
import { teachers } from "@/lib/data";

export default function AbsensiGuruPage() {
    return (
        <>
            <PageHeader title="Absensi Guru" description="Pantau dan kelola absensi guru." />
            <TeacherAttendanceClient teachers={teachers} />
        </>
    );
}
