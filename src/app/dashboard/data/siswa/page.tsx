import { PageHeader } from "@/components/page-header";
import { StudentDataClient } from "@/components/dashboard/data/siswa/student-data-client";
import { students, classes } from "@/lib/data";

export default function DataSiswaPage() {
    return (
        <>
            <PageHeader title="Data Siswa" description="Kelola data semua siswa di sekolah." />
            <StudentDataClient initialStudents={students} classes={classes} />
        </>
    );
}