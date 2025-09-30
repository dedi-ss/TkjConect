"use client";

import { useState, useMemo, type FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  FileUp,
  PlusCircle,
  Search,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";
import type { Student } from "@/lib/types";

const StatCard: FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <Card className="shadow">
        <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </CardContent>
    </Card>
);

export function StudentDataClient({
  initialStudents,
  classes,
}: {
  initialStudents: Student[];
  classes: string[];
}) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("Semua Kelas");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchMatch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nis.toLowerCase().includes(searchQuery.toLowerCase());
      const classMatch =
        classFilter === "Semua Kelas" || student.class === classFilter;
      return searchMatch && classMatch;
    });
  }, [students, searchQuery, classFilter]);
  
  const stats = useMemo(() => {
    const totalSiswa = students.length;
    const siswaAktif = students.filter(s => s.status === 'Aktif').length;
    const siswaTidakAktif = totalSiswa - siswaAktif;
    const totalKelas = new Set(students.map(s => s.class)).size;
    return { totalSiswa, siswaAktif, siswaTidakAktif, totalKelas };
  }, [students]);

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      setStudents(students.filter((s) => s.id !== studentToDelete.id));
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <Label htmlFor="search-student">Cari Siswa</Label>
            <div className="relative mt-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-student"
                placeholder="Nama atau NIS..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="class-filter">Filter Kelas</Label>
            <Select
              value={classFilter}
              onValueChange={setClassFilter}
            >
              <SelectTrigger id="class-filter" className="mt-1">
                <SelectValue placeholder="Semua Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua Kelas">Semua Kelas</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button>
            <PlusCircle className="mr-2" />
            Tambah Siswa
          </Button>
          <Button variant="outline">
            <FileUp className="mr-2" />
            Export Excel
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Siswa" value={stats.totalSiswa} />
        <StatCard title="Siswa Aktif" value={stats.siswaAktif} />
        <StatCard title="Siswa Tidak Aktif" value={stats.siswaTidakAktif} />
        <StatCard title="Total Kelas" value={stats.totalKelas} />
      </div>

      <Card>
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Daftar Siswa</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Total: {filteredStudents.length} siswa
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-primary/80">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No.</TableHead>
                  <TableHead>NIS</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>JK</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.nis}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === "Aktif" ? "default" : "destructive"}
                        className={student.status === "Aktif" ? "bg-accent text-accent-foreground" : ""}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(student)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data siswa
              <span className="font-bold"> {studentToDelete?.name}</span>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}