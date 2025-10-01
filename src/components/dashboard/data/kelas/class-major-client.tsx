"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  PlusCircle,
  RefreshCw,
  Edit,
  Trash2,
  Upload,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Class = {
  id: string;
  name: string;
  major: string;
};

type Major = {
  id: string;
  name: string;
};

const CLASS_STORAGE_KEY = 'edutrack-classes';
const MAJOR_STORAGE_KEY = 'edutrack-majors';

// Convert initialMajors from string array to object array
const formatInitialMajors = (majors: string[]): Major[] =>
  majors.map((major, index) => ({ id: (index + 1).toString(), name: major }));

export function ClassMajorClient({
  initialClasses,
  initialMajors: initialMajorsList,
}: {
  initialClasses: Class[];
  initialMajors: string[];
}) {
  const { toast } = useToast();

  const [classes, setClasses] = useState<Class[]>(() => {
    if (typeof window === 'undefined') return initialClasses;
    const stored = localStorage.getItem(CLASS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialClasses;
  });

  const [majors, setMajors] = useState<Major[]>(() => {
    if (typeof window === 'undefined') return formatInitialMajors(initialMajorsList);
    const stored = localStorage.getItem(MAJOR_STORAGE_KEY);
    return stored ? JSON.parse(stored) : formatInitialMajors(initialMajorsList);
  });
  
  useEffect(() => {
    localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(MAJOR_STORAGE_KEY, JSON.stringify(majors));
  }, [majors]);

  // Dialog States
  const [isClassFormOpen, setIsClassFormOpen] = useState(false);
  const [isMajorFormOpen, setIsMajorFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Form & Delete States
  const [editingItem, setEditingItem] = useState<Class | Major | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'class' | 'major', data: Class | Major } | null>(null);
  const [newClassName, setNewClassName] = useState('');
  const [newClassMajor, setNewClassMajor] = useState('');
  const [newMajorName, setNewMajorName] = useState('');
  
  // Handlers for Opening Dialogs
  const handleOpenClassForm = (cls: Class | null) => {
    setEditingItem(cls);
    setNewClassName(cls?.name || '');
    setNewClassMajor(cls?.major || '');
    setIsClassFormOpen(true);
  };
  
  const handleOpenMajorForm = (major: Major | null) => {
    setEditingItem(major);
    setNewMajorName(major?.name || '');
    setIsMajorFormOpen(true);
  };

  const handleDeleteClick = (type: 'class' | 'major', data: Class | Major) => {
    setItemToDelete({ type, data });
    setIsDeleteDialogOpen(true);
  };

  // CRUD Operations
  const handleSaveClass = () => {
    if (!newClassName || !newClassMajor) {
        toast({ variant: 'destructive', title: 'Error', description: 'Nama kelas dan jurusan tidak boleh kosong.' });
        return;
    }
    if (editingItem && 'major' in editingItem) { // Editing
      setClasses(classes.map(c => c.id === editingItem.id ? { ...c, name: newClassName, major: newClassMajor } : c));
      toast({ title: 'Sukses', description: 'Data kelas berhasil diperbarui.' });
    } else { // Adding
      const newClass: Class = { id: Date.now().toString(), name: newClassName, major: newClassMajor };
      setClasses([newClass, ...classes]);
      toast({ title: 'Sukses', description: 'Kelas baru berhasil ditambahkan.' });
    }
    setIsClassFormOpen(false);
    setEditingItem(null);
  };
  
  const handleSaveMajor = () => {
    if (!newMajorName) {
        toast({ variant: 'destructive', title: 'Error', description: 'Nama jurusan tidak boleh kosong.' });
        return;
    }
    if (majors.some(m => m.name.toLowerCase() === newMajorName.toLowerCase() && m.id !== (editingItem as Major)?.id)) {
        toast({ variant: 'destructive', title: 'Error', description: 'Nama jurusan sudah ada.' });
        return;
    }
    if (editingItem && !('major' in editingItem)) { // Editing
      setMajors(majors.map(m => m.id === editingItem.id ? { ...m, name: newMajorName } : m));
      toast({ title: 'Sukses', description: 'Data jurusan berhasil diperbarui.' });
    } else { // Adding
      const newMajor: Major = { id: Date.now().toString(), name: newMajorName };
      setMajors([newMajor, ...majors]);
      toast({ title: 'Sukses', description: 'Jurusan baru berhasil ditambahkan.' });
    }
    setIsMajorFormOpen(false);
    setEditingItem(null);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    const { type, data } = itemToDelete;
    if (type === 'class') {
      setClasses(classes.filter((c) => c.id !== (data as Class).id));
      toast({ title: 'Dihapus', description: `Kelas "${(data as Class).name} - ${(data as Class).major}" telah dihapus.` });
    } else {
      setMajors(majors.filter((m) => m.id !== (data as Major).id));
      toast({ title: 'Dihapus', description: `Jurusan "${(data as Major).name}" telah dihapus.` });
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };
  
  const handleRefresh = (type: 'class' | 'major') => {
    if (type === 'class') {
      setClasses(initialClasses);
      toast({ title: 'Refresh', description: 'Data kelas telah dikembalikan ke data awal.' });
    } else {
      setMajors(formatInitialMajors(initialMajorsList));
      toast({ title: 'Refresh', description: 'Data jurusan telah dikembalikan ke data awal.' });
    }
  };

  const handleImport = () => {
    setIsImportDialogOpen(false);
    toast({ title: 'Import Berhasil (Simulasi)', description: 'Data kelas & jurusan telah diimpor.' });
  };


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Management Card */}
        <Card>
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Daftar Kelas</CardTitle>
                <CardDescription className="text-primary-foreground/80">Angkatan 2022/2023</CardDescription>
              </div>
              <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleOpenClassForm(null)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Tambah
                  </Button>
                  <Button size="sm" variant="ghost" className="hover:bg-primary/80" onClick={() => handleRefresh('class')}>
                      <RefreshCw className="h-4 w-4" />
                  </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Kelas / Tingkat</TableHead>
                    <TableHead>Jurusan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls, index) => (
                    <TableRow key={cls.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.major}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20" onClick={() => handleOpenClassForm(cls)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick('class', cls)}
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

        {/* Major Management Card */}
        <Card>
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Daftar Jurusan</CardTitle>
                <CardDescription className="text-primary-foreground/80">Bidang Keahlian</CardDescription>
              </div>
              <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleOpenMajorForm(null)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Tambah
                  </Button>
                  <Button size="sm" variant="ghost" className="hover:bg-primary/80" onClick={() => handleRefresh('major')}>
                      <RefreshCw className="h-4 w-4" />
                  </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Jurusan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {majors.map((major, index) => (
                    <TableRow key={major.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{major.name}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20" onClick={() => handleOpenMajorForm(major)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick('major', major)}
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
      </div>

        <Button variant="outline" className="w-full md:w-auto" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="mr-2"/> Import Data Kelas & Jurusan
        </Button>

      {/* Class Form Dialog */}
      <Dialog open={isClassFormOpen} onOpenChange={setIsClassFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Kelas' : 'Tambah Kelas Baru'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class-name" className="text-right">Nama Kelas</Label>
              <Input id="class-name" value={newClassName} onChange={e => setNewClassName(e.target.value)} className="col-span-3" placeholder="cth. X, XI, XII" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class-major" className="text-right">Jurusan</Label>
              <Select onValueChange={setNewClassMajor} value={newClassMajor}>
                <SelectTrigger id="class-major" className="col-span-3">
                  <SelectValue placeholder="Pilih Jurusan" />
                </SelectTrigger>
                <SelectContent>
                  {majors.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button onClick={handleSaveClass}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Major Form Dialog */}
      <Dialog open={isMajorFormOpen} onOpenChange={setIsMajorFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Jurusan' : 'Tambah Jurusan Baru'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="major-name" className="text-right">Nama Jurusan</Label>
              <Input id="major-name" value={newMajorName} onChange={e => setNewMajorName(e.target.value)} className="col-span-3" placeholder="cth. Rekayasa Perangkat Lunak" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button onClick={handleSaveMajor}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Import Data Kelas & Jurusan</DialogTitle>
                <DialogDescription>
                Pilih file Excel (.xlsx) untuk mengimpor data. Pastikan format file sesuai dengan template.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div>
                    <Label htmlFor="file-upload">File Excel</Label>
                    <Input id="file-upload" type="file" accept=".xlsx, .xls" className="mt-1" />
                </div>
                <Button variant="link" className="p-0 h-auto">Download Template</Button>
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
