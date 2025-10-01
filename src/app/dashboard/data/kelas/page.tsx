import { PageHeader } from "@/components/page-header";
import { ClassMajorClient } from "@/components/dashboard/data/kelas/class-major-client";
import { classes as initialClassesData, majors } from "@/lib/data";

const classData = [
    { id: '1', name: 'X', major: 'TKJ 1' },
    { id: '2', name: 'X', major: 'TKJ 2' },
    { id: '3', name: 'XI', major: 'TKJ 1' },
    { id: '4', name: 'XI', major: 'TKJ 2' },
    { id: '5', name: 'XI', major: 'TKJ 3' },
    { id: '6', name: 'XII', major: 'TKJ 1' },
    { id: '7', name: 'XII', major: 'TKJ 2' },
  
];

export default function DataKelasPage() {
    return (
        <>
            <PageHeader title="Kelas & Jurusan" description="Kelola daftar kelas dan jurusan untuk tahun ajaran." />
            <ClassMajorClient initialClasses={classData} initialMajors={majors} />
        </>
    );
}

    