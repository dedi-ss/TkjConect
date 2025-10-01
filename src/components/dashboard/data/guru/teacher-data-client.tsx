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
import type { Teacher } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const teacherSchema = z.object({
    name: z.string().min(1, "Nama tidak boleh kosong"),
    nip: z.string().min(1, "NIP tidak boleh kosong"),
    subject: z.string().min(1, "Mata pelajaran tidak boleh kosong"),
    gender: z.enum(["L", "P"], { required_error: "Jenis kelamin harus dipilih" }),
    status: z.enum(["Aktif", "Tidak Aktif"], { required_error: "Status harus dipilih" }),
});

const LOCAL_STORAGE_KEY = 'edutrack-teachers';

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
  subjects: allSubjects,
}: {
  initialTeachers: Teacher[];
  subjects: string[];
}) {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    try {
      const storedTeachers = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTeachers) {
        setTeachers(JSON.parse(storedTeachers));
      }
    } catch (error) {
      console.error("Gagal memuat data guru dari localStorage", error);
      setTeachers(initialTeachers);
    }
  }, [initialTeachers]);

  useEffect(() => {
    if (isClient) {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(teachers));
      } catch (error) {
        console.error("Gagal menyimpan data guru ke localStorage", error);
      }
    }
  }, [teachers, isClient]);

  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("Semua Mata Pelajaran");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const form = useForm<z.infer<typeof teacherSchema>>({
    resolver: zodResolver(teacherSchema),
  });

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
    const guruSenior = teachers.filter(t => new Date().getFullYear() - new Date(parseInt(t.nip.substring(0, 4)), parseInt(t.nip.substring(4, 6)) - 1).getFullYear() > 10).length;
    const kepalaJurusan = teachers.filter(t => t.name.includes('Kepala Jurusan')).length;
    return { totalGuru, guruAktif, guruSenior, kepalaJurusan };
  }, [teachers]);

  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      setTeachers(teachers.filter((t) => t.id !== teacherToDelete.id));
      toast({ title: "Sukses", description: `Data guru "${teacherToDelete.name}" telah dihapus.` });
      setIsDeleteDialogOpen(false);
      setTeacherToDelete(null);
    }
  };
  
  const openFormDialog = (teacher: Teacher | null) => {
    setEditingTeacher(teacher);
    form.reset(teacher ? teacher : {
      name: "",
      nip: "",
      subject: undefined,
      gender: undefined,
      status: "Aktif",
    });
    setIsFormDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof teacherSchema>) => {
    if (editingTeacher) {
      setTeachers(teachers.map(t => t.id === editingTeacher.id ? { ...t, ...values } : t));
      toast({ title: "Sukses", description: "Data guru berhasil diperbarui." });
    } else {
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        avatar: 'user-avatar-1',
        ...values,
      };
      setTeachers([newTeacher, ...teachers]);
      toast({ title: "Sukses", description: "Guru baru berhasil ditambahkan." });
    }
    setIsFormDialogOpen(false);
    setEditingTeacher(null);
  };

  const handleRefresh = () => {
    setTeachers(initialTeachers);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast({ title: "Refresh", description: "Data guru telah dikembalikan ke data awal." });
  };

  const handleExport = () => {
    toast({ title: "Fungsi Belum Tersedia", description: "Fitur export ke Excel sedang dalam pengembangan." });
  };
  
  const handleImport = () => {
    const importedTeachers: Teacher[] = [
      { id: `import-guru-${Date.now()}`, nip: '199001012024011001', name: 'Guru Impor Satu', subject: 'PKK', gender: 'L', status: 'Aktif', avatar: 'user-avatar-1' },
      { id: `import-guru-${Date.now()+1}`, nip: '199202022024022002', name: 'Guru Impor Dua', subject: 'Koding dan Kecerdasan Artifisial (KA)', gender: 'P', status: 'Aktif', avatar: 'user-avatar-1' },
    ];
    setTeachers(prev => [...importedTeachers, ...prev]);
    setIsImportDialogOpen(false);
    toast({ title: "Import Berhasil (Simulasi)", description: "Data guru dari file Excel telah berhasil diimpor dan disimpan." });
  }

  const handleDownloadTemplate = () => {
    const csvHeader = "nama,nip,mata_pelajaran,jenis_kelamin (L/P),status (Aktif/Tidak Aktif)\n";
    const csvExample = "Bambang Pamungkas,198501012010011001,PKK,L,Aktif\nSusi Susanti,198602022011022002,Koding dan Kecerdasan Artifisial (KA),P,Aktif\n";
    const csvContent = csvHeader + csvExample;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_import_guru.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Template Diunduh", description: "Template import guru telah diunduh." });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <Label htmlFor="search-teacher" className="text-sm font-medium">Cari Guru</Label>
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
            <Label htmlFor="subject-filter" className="text-sm font-medium">Filter Mata Pelajaran</Label>
            <Select
              value={subjectFilter}
              onValueChange={setSubjectFilter}
            >
              <SelectTrigger id="subject-filter" className="mt-1">
                <SelectValue placeholder="Semua Mata Pelajaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua Mata Pelajaran">Semua Mata Pelajaran</SelectItem>
                {allSubjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2 md:col-span-2">
            <Button onClick={() => openFormDialog(null)} className="w-full">
              <PlusCircle className="mr-2" />
              Tambah
            </Button>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
                <Upload className="mr-2" />
                Import
            </Button>
            <Button variant="outline" onClick={handleExport} className="col-span-2">
              <FileUp className="mr-2" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Guru" value={stats.totalGuru} />
        <StatCard title="Guru Aktif" value={stats.guruAktif} />
        <StatCard title="Guru Senior" value={stats.guruSenior} />
        <StatCard title="Kepala Jurusan" value={stats.kepalaJurusan} />
      </div>

      <Card>
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Daftar Guru</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Total: {filteredTeachers.length} guru
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
                        className={teacher.status === "Aktif" ? "bg-accent text-accent-foreground" : ""}>
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => openFormDialog(teacher)}>
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

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTeacher ? 'Edit Data Guru' : 'Tambah Guru Baru'}</DialogTitle>
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
                      <Input placeholder="cth. Dr. Budi, S.Pd, M.Pd" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIP</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan NIP..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Mata Pelajaran</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                              <SelectTrigger><SelectValue placeholder="Pilih Mata Pelajaran" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              {allSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
              <DialogFooter className="pt-4">
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
            <DialogTitle>Import Data Guru</DialogTitle>
            <DialogDescription>
              Pilih file Excel (.xlsx) untuk mengimpor data guru. Pastikan format file sesuai dengan template.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
                <Label htmlFor="file-upload">File Excel</Label>
                <Input id="file-upload" type="file" accept=".xlsx, .xls, .csv" className="mt-1" />
            </div>
            <Button variant="link" className="p-0 h-auto" onClick={handleDownloadTemplate}>Download Template</Button>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button onClick={handleImport}><Upload className="mr-2" />Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
