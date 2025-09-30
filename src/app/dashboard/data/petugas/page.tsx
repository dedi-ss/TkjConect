import { PageHeader } from "@/components/page-header";
import { OfficerDataClient } from "@/components/dashboard/data/petugas/officer-data-client";
import { officers, officerDepartments } from "@/lib/data";

export default function DataPetugasPage() {
    return (
        <>
            <PageHeader title="Data Petugas" description="Kelola data semua petugas dan administrator sistem." />
            <OfficerDataClient initialOfficers={officers} departments={officerDepartments} />
        </>
    );
}
