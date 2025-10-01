import { PageHeader } from "@/components/page-header";
import { TeacherDataClient } from "@/components/dashboard/data/guru/teacher-data-client";
import { teachers, initialSubjects } from "@/lib/data";

export default function DataGuruPage() {
    return (
        <>
            <PageHeader title="Data Guru" description="Kelola data semua guru dan staf pengajar." />
            <TeacherDataClient initialTeachers={teachers} subjects={initialSubjects} />
        </>
    );
}
