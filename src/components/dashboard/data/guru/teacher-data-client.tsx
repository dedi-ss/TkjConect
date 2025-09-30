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
} from "@/components/ui/dialog";
import {
  FileUp,
  PlusCircle,
  Search,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";
import type { Teacher } from "@/lib/types";

const StatCard: FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <Card className="shadow">
        <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </CardContent>
    </Card>
);

export function TeacherDataClient({
  initialTeachers,
  subjects,
}: {
  initialTeachers: Teacher[];
  subjects: string[];
}) {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("Semua Mata Pelajaran");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const query = searchQuery.toLowerCase();
      const searchMatch =
        teacher.name.toLowerCase().includes(query) ||
        teacher.nip.toLowerCase().includes(query);
      const subjectMatch =
        subjectFilter === "Semua Mata Pelajaran" || teacher.subject === subjectFilter;
      return searchMatch && subjectMatch;
    });
  }, [teachers, searchQuery, subjectFilter]);
  
  const stats = useMemo(() => {
    const totalGuru = teachers.length;
    const guruAktif = teachers.filter(t => t.status === 'Aktif').length;
    // These are placeholders as the data is not in the model
    const guruSenior = 20; 
    const kepalaJurusan = 15;
    return { totalGuru, guruAktif, guruSenior, kepalaJurusan };
  }, [teachers]);

  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      setTeachers(teachers.filter((t) => t.id !== teacherToDelete.id));
      setIsDeleteDialogOpen(false);
      setTeacherToDelete(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label htmlFor="search-teacher" className="text-sm font-medium">Cari Guru</label>
            <div className="relative mt-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-teacher"
                placeholder="Nama atau NIP..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject-filter" className="text-sm font-medium">Filter Mata Pelajaran</label>
            <Select
              value={subjectFilter}
              onValueChange={setSubjectFilter}
            >
              <SelectTrigger id="subject-filter" className="mt-1">
                <SelectValue placeholder="Semua Mata Pelajaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua Mata Pelajaran">Semua Mata Pelajaran</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button>
            <PlusCircle className="mr-2" />
            Tambah Guru
          </Button>
          <Button variant="outline">
            <FileUp className="mr-2" />
            Export Excel
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Guru" value={stats.totalGuru} />
        <StatCard title="Guru Aktif" value={stats.guruAktif} />
        <StatCard title="Guru Senior" value={stats.guruSenior} />
        <StatCard title="Kepala Jurusan" value={stats.kepalaJurusan} />
      </div>

      <Card>
        <CardHeader className="bg-accent text-accent-foreground rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Daftar Guru</CardTitle>
              <CardDescription className="text-accent-foreground/80">
                Total: {filteredTeachers.length} guru
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-accent/80">
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
                  <TableHead>NIP</TableHead>
                  <TableHead>Nama Guru</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead>JK</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher, index) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{teacher.nip}</TableCell>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.subject}</TableCell>
                    <TableCell>{teacher.gender}</TableCell>
                    <TableCell>
                      <Badge variant={teacher.status === "Aktif" ? "default" : "destructive"}
                        className={teacher.status === "Aktif" ? "bg-green-500 text-white" : ""}>
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(teacher)}
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
              Apakah Anda yakin ingin menghapus data guru
              <span className="font-bold"> {teacherToDelete?.name}</span>? Tindakan ini tidak dapat dibatalkan.
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