import { PageHeader } from "@/components/page-header";
import { SubjectDataClient } from "@/components/dashboard/data/mata-pelajaran/subject-data-client";
import { initialSubjects } from "@/lib/data";

export default function DataMataPelajaranPage() {
    return (
        <>
            <PageHeader title="Data Mata Pelajaran" description="Kelola daftar mata pelajaran yang tersedia di sekolah." />
            <SubjectDataClient initialSubjects={initialSubjects} />
        </>
    );
}
