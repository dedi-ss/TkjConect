import { PageHeader } from "@/components/page-header";
import { GenerateLaporanClient } from "@/components/dashboard/laporan/generate-laporan-client";

export default function GenerateLaporanPage() {
    return (
        <>
            <PageHeader title="Generate Laporan" description="Buat dan unduh laporan absensi." />
            <GenerateLaporanClient />
        </>
    );
}
