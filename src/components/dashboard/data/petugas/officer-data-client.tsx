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
} from "lucide-react";
import type { Officer } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const officerSchema = z.object({
    name: z.string().min(1, "Nama tidak boleh kosong"),
    nip: z.string().min(1, "NIP tidak boleh kosong"),
    position: z.string().min(1, "Jabatan tidak boleh kosong"),
    department: z.string().min(1, "Bagian tidak boleh kosong"),
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

export function OfficerDataClient({
  initialOfficers,
  departments,
}: {
  initialOfficers: Officer[];
  departments: string[];
}) {
  const [officers, setOfficers] = useState<Officer[]>(initialOfficers);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("Semua Bagian");
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [officerToDelete, setOfficerToDelete] = useState<Officer | null>(null);

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof officerSchema>>({
    resolver: zodResolver(officerSchema),
  });

  useEffect(() => {
    if (editingOfficer) {
      form.reset(editingOfficer);
    } else {
      form.reset({
        name: "",
        nip: "",
        position: "",
        department: undefined,
        gender: undefined,
        status: "Aktif",
      });
    }
  }, [editingOfficer, form]);


  const filteredOfficers = useMemo(() => {
    return officers.filter((officer) => {
      const query = searchQuery.toLowerCase();
      const searchMatch =
        officer.name.toLowerCase().includes(query) ||
        officer.nip.toLowerCase().includes(query) ||
        officer.position.toLowerCase().includes(query);
      const departmentMatch =
        departmentFilter === "Semua Bagian" || officer.department === departmentFilter;
      return searchMatch && departmentMatch;
    });
  }, [officers, searchQuery, departmentFilter]);
  
  const stats = useMemo(() => {
    const totalPetugas = officers.length;
    const petugasAktif = officers.filter(o => o.status === 'Aktif').length;
    const totalBagian = new Set(officers.map(o => o.department)).size;
    const staffSenior = officers.filter(o => o.position.includes('Kepala')).length;
    return { totalPetugas, petugasAktif, totalBagian, staffSenior };
  }, [officers]);

  const handleDeleteClick = (officer: Officer) => {
    setOfficerToDelete(officer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (officerToDelete) {
      setOfficers(officers.filter((o) => o.id !== officerToDelete.id));
      toast({ title: "Sukses", description: `Petugas "${officerToDelete.name}" berhasil dihapus.` });
      setIsDeleteDialogOpen(false);
      setOfficerToDelete(null);
    }
  };

  const handleRefresh = () => {
    setOfficers(initialOfficers);
    setSearchQuery("");
    setDepartmentFilter("Semua Bagian");
    toast({ title: "Data Dimuat Ulang", description: "Data petugas telah di-refresh ke kondisi awal." });
  };
  
  const handleExport = () => {
    toast({ title: "Fungsi Belum Tersedia", description: "Fitur export ke Excel sedang dalam pengembangan." });
  };
  
  const openFormDialog = (officer: Officer | null) => {
    setEditingOfficer(officer);
    setIsFormDialogOpen(true);
  };
  
  const onSubmit = (values: z.infer<typeof officerSchema>) => {
    if (editingOfficer) {
      setOfficers(officers.map(o => o.id === editingOfficer.id ? { ...o, ...values } : o));
      toast({ title: "Sukses", description: "Data petugas berhasil diperbarui." });
    } else {
      const newOfficer: Officer = {
        id: (officers.length + 1).toString(),
        avatar: 'user-avatar-1',
        ...values,
      };
      setOfficers([newOfficer, ...officers]);
      toast({ title: "Sukses", description: "Petugas baru berhasil ditambahkan." });
    }
    setIsFormDialogOpen(false);
    setEditingOfficer(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label htmlFor="search-officer" className="text-sm font-medium">Cari Petugas</label>
            <div className="relative mt-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-officer"
                placeholder="Nama, NIP, atau Jabatan..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="department-filter" className="text-sm font-medium">Filter Bagian</label>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger id="department-filter" className="mt-1">
                <SelectValue placeholder="Semua Bagian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua Bagian">Semua Bagian</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => openFormDialog(null)}>
            <PlusCircle className="mr-2" />
            Tambah Petugas
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <FileUp className="mr-2" />
            Export Excel
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Petugas" value={stats.totalPetugas} />
        <StatCard title="Petugas Aktif" value={stats.petugasAktif} />
        <StatCard title="Total Bagian" value={stats.totalBagian} />
        <StatCard title="Staff Senior" value={stats.staffSenior} />
      </div>

      <Card>
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Daftar Petugas</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Total: {filteredOfficers.length} petugas
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
                  <TableHead>Nama Petugas</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Bagian</TableHead>
                  <TableHead>JK</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOfficers.map((officer, index) => (
                  <TableRow key={officer.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{officer.nip}</TableCell>
                    <TableCell className="font-medium">{officer.name}</TableCell>
                    <TableCell>{officer.position}</TableCell>
                    <TableCell>{officer.department}</TableCell>
                    <TableCell>{officer.gender}</TableCell>
                    <TableCell>
                      <Badge variant={officer.status === "Aktif" ? "default" : "destructive"}
                        className={officer.status === "Aktif" ? "bg-accent text-accent-foreground" : ""}>
                        {officer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => openFormDialog(officer)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(officer)}
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
              Apakah Anda yakin ingin menghapus data petugas
              <span className="font-bold"> {officerToDelete?.name}</span>? Tindakan ini tidak dapat dibatalkan.
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
            <DialogTitle>{editingOfficer ? 'Edit Petugas' : 'Tambah Petugas Baru'}</DialogTitle>
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
                      <Input placeholder="cth. Budi Santoso, S.Kom" {...field} />
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
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jabatan</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Staff Administrasi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Bagian</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                              <SelectTrigger><SelectValue placeholder="Pilih Bagian" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              {departments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
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
    </div>
  );
}
