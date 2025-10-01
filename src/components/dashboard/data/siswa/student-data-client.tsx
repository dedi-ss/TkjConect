
"use client";

import { useState, useMemo, type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
  FileUp,
  PlusCircle,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Upload,
} from "lucide-react";
import type { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const studentSchema = z.object({
    name: z.string().min(1, "Nama tidak boleh kosong"),
    nis: z.string().min(1, "NIS tidak boleh kosong"),
    class: z.string().min(1, "Kelas harus dipilih"),
    gender: z.enum(["L", "P"], { required_error: "Jenis kelamin harus dipilih" }),
    status: z.enum(["Aktif", "Tidak Aktif"], { required_error: "Status harus dipilih" }),
});


const StatCard: FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <Card className="shadow">
        <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </CardContent>
    </Card>
);

const LOCAL_STORAGE_KEY = 'edutrack-students';

export function StudentDataClient({
  initialStudents,
  classes,
  majors,
}: {
  initialStudents: Student[];
  classes: string[];
  majors: string[];
}) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isClient, setIsClient] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("Semua Kelas");
  const [majorFilter, setMajorFilter] = useState("Semua Jurusan");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    try {
      const storedStudents = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      } else {
        setStudents(initialStudents);
      }
    } catch (error) {
      console.error("Gagal memuat data dari localStorage", error);
      setStudents(initialStudents);
    }
  }, [initialStudents]);


  useEffect(() => {
    if (isClient) {
        try {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
        } catch (error) {
            console.error("Gagal menyimpan data ke localStorage", error);
        }
    }
  }, [students, isClient]);

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      nis: "",
      class: undefined,
      gender: undefined,
      status: "Aktif",
    }
  });

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchMatch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nis.toLowerCase().includes(searchQuery.toLowerCase());
      const classMatch =
        classFilter === "Semua Kelas" || student.class === classFilter;
      
      const majorMatch = majorFilter === "Semua Jurusan" || student.class.toLowerCase().includes(majorFilter.toLowerCase().split(' ')[0]);

      return searchMatch && classMatch && majorMatch;
    });
  }, [students, searchQuery, classFilter, majorFilter]);
  
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
      toast({ title: "Sukses", description: `Data siswa "${studentToDelete.name}" berhasil dihapus.` });
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const openFormDialog = (student: Student | null) => {
    setEditingStudent(student);
    if (student) {
        form.reset(student);
    } else {
        form.reset({
            name: "",
            nis: "",
            class: undefined,
            gender: undefined,
            status: "Aktif",
        });
    }
    setIsFormDialogOpen(true);
  };
  
  const onSubmit = (values: z.infer<typeof studentSchema>) => {
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...values } : s));
      toast({ title: "Sukses", description: "Data siswa berhasil diperbarui." });
    } else {
      const newStudent: Student = {
        id: (students.length + 1 + Math.random()).toString(),
        avatar: `student-avatar-${(students.length % 5) + 1}`,
        ...values,
      };
      setStudents([newStudent, ...students]);
      toast({ title: "Sukses", description: "Siswa baru berhasil ditambahkan." });
    }
    setIsFormDialogOpen(false);
    setEditingStudent(null);
  };

  const handleRefresh = () => {
    setStudents(initialStudents);
    if (isClient) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    toast({ title: "Refresh", description: "Data siswa telah dikembalikan ke data awal." });
  };
  
  const handleExport = () => {
    toast({ title: "Fungsi Belum Tersedia", description: "Fitur export ke Excel sedang dalam pengembangan." });
  };
  
  const handleImport = () => {
    const importedStudents: Student[] = [
        { id: `import-${Date.now()}`, nis: '99991', name: 'Siswa Impor Satu', class: 'XII RPL 1', gender: 'L', status: 'Aktif', avatar: 'student-avatar-1' },
        { id: `import-${Date.now()+1}`, nis: '99992', name: 'Siswa Impor Dua', class: 'XII RPL 1', gender: 'P', status: 'Aktif', avatar: 'student-avatar-2' },
    ];
    setStudents(prev => [...importedStudents, ...prev]);
    setIsImportDialogOpen(false);
    toast({ title: "Import Berhasil (Simulasi)", description: "Data siswa baru telah ditambahkan dan disimpan." });
  }

  const handleDownloadTemplate = () => {
    const csvHeader = "nama,nis,kelas,jenis_kelamin (L/P),status (Aktif/Tidak Aktif)\n";
    const csvExample = "John Doe,12345,XII RPL 1,L,Aktif\nJane Smith,12346,XII RPL 1,P,Aktif\n";
    const csvContent = csvHeader + csvExample;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_import_siswa.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Template Diunduh", description: "Template import siswa telah diunduh." });
  };

  if (!isClient) {
    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-4">
                    <div className="h-10 bg-muted rounded-md w-1/2 mx-auto animate-pulse"></div>
                </CardContent>
            </Card>
        </div>
    );
  }
  
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
            <Label htmlFor="major-filter">Filter Jurusan</Label>
            <Select value={majorFilter} onValueChange={setMajorFilter}>
              <SelectTrigger id="major-filter" className="mt-1">
                <SelectValue placeholder="Semua Jurusan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua Jurusan">Semua Jurusan</SelectItem>
                {majors.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <div className="grid grid-cols-1 gap-2">
            <Button onClick={() => openFormDialog(null)} className="w-full">
              <PlusCircle className="mr-2" />
              Tambah
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
                  <Upload className="mr-2" />
                  Import
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <FileUp className="mr-2" />
                Export
              </Button>
            </div>
          </div>
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
            <Button variant="ghost" size="sm" className="hover:bg-primary/80" onClick={handleRefresh}>
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
                        <Button variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => openFormDialog(student)}>
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

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingStudent ? 'Edit Siswa' : 'Tambah Siswa Baru'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Budi Santoso" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIS</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan NIS..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Kelas</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                              <SelectTrigger><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                      </Select>
                      <FormMessage />
                      </FormItem>
                  )}
              />
               <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Jenis Kelamin</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                              <SelectTrigger><SelectValue placeholder="Pilih Jenis Kelamin" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              <SelectItem value="L">Laki-laki</SelectItem>
                              <SelectItem value="P">Perempuan</SelectItem>
                          </SelectContent>
                      </Select>
                      <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                              <SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              <SelectItem value="Aktif">Aktif</SelectItem>
                              <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                          </SelectContent>
                      </Select>
                      <FormMessage />
                      </FormItem>
                  )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Batal</Button>
                </DialogClose>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data Siswa</DialogTitle>
            <DialogDescription>
              Pilih file Excel (.xlsx) untuk mengimpor data siswa secara massal. Pastikan format file sesuai dengan template.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="class-import-filter">Impor ke Kelas</Label>
                <Select defaultValue={classes[0]}>
                    <SelectTrigger id="class-import-filter" className="mt-1">
                        <SelectValue placeholder="Pilih Kelas Tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map((c) => (
                        <SelectItem key={c} value={c}>
                            {c}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            <div>
                <Label htmlFor="file-upload">File Excel</Label>
                <Input id="file-upload" type="file" accept=".xlsx, .xls, .csv" className="mt-1" />
            </div>
            <Button variant="link" className="p-0 h-auto" onClick={handleDownloadTemplate}>Download Template</Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button onClick={handleImport}>
              <Upload className="mr-2" />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
