import { PageHeader } from "@/components/page-header";
import { StudentAttendanceClient } from "@/components/dashboard/absensi/siswa/student-attendance-client";
import { students, classes } from "@/lib/data";

export default function AbsensiSiswaPage() {
    return (
        <>
            <PageHeader title="Absensi Siswa" description="Pilih kelas dan tanggal untuk mengelola absensi siswa." />
            <StudentAttendanceClient students={students} classes={classes} />
        </>
    );
}
