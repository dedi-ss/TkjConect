import { PageHeader } from "@/components/page-header";
import { ClassMajorClient } from "@/components/dashboard/data/kelas/class-major-client";
import { classes, majors } from "@/lib/data";

const classData = [
    { id: '1', name: 'X', major: 'OTKP' },
    { id: '2', name: 'X', major: 'BDP' },
    { id: '3', name: 'X', major: 'AKL' },
    { id: '4', name: 'X', major: 'RPL' },
    { id: '5', name: 'XI', major: 'OTKP' },
    { id: '6', name: 'XI', major: 'BDP' },
    { id: '7', name: 'XI', major: 'AKL' },
    { id: '8', name: 'XI', major: 'RPL' },
];

export default function DataKelasPage() {
    return (
        <>
            <PageHeader title="Kelas & Jurusan" description="Kelola daftar kelas dan jurusan untuk tahun ajaran." />
            <ClassMajorClient initialClasses={classData} initialMajors={majors} />
        </>
    );
}
