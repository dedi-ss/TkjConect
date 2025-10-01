"use client";

import { useState, useEffect, useMemo } from 'react';
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
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Subject } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const SUBJECT_STORAGE_KEY = 'edutrack-subjects';

// Format initial string array to Subject object array
const formatInitialSubjects = (subjects: string[]): Subject[] =>
  subjects.map((subject, index) => {
    const code = subject.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4) + (index + 1);
    return { id: (index + 1).toString(), name: subject, code };
  });

export function SubjectDataClient({
  initialSubjects: initialSubjectsList,
}: {
  initialSubjects: string[];
}) {
  const { toast } = useToast();
  const formattedInitialSubjects = formatInitialSubjects(initialSubjectsList);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
        const storedSubjects = localStorage.getItem(SUBJECT_STORAGE_KEY);
        if (storedSubjects) {
            setSubjects(JSON.parse(storedSubjects));
        } else {
            setSubjects(formattedInitialSubjects);
        }
    } catch (error) {
        console.error("Failed to parse subjects from localStorage", error);
        setSubjects(formattedInitialSubjects);
    }
  }, [formattedInitialSubjects]);
  
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(SUBJECT_STORAGE_KEY, JSON.stringify(subjects));
    }
  }, [subjects, isClient]);

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Form & Delete States
  const [editingItem, setEditingItem] = useState<Subject | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Subject | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  
  // Filtered Memo
  const filteredSubjects = useMemo(() => {
    if (!isClient) return [];
    return subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subjects, searchQuery, isClient]);

  // Handlers for Opening Dialogs
  const handleOpenForm = (subject: Subject | null) => {
    setEditingItem(subject);
    setNewSubjectName(subject?.name || '');
    setNewSubjectCode(subject?.code || '');
    setIsFormOpen(true);
  };

  const handleDeleteClick = (subject: Subject) => {
    setItemToDelete(subject);
    setIsDeleteDialogOpen(true);
  };

  // CRUD Operations
  const handleSaveSubject = () => {
    if (!newSubjectName || !newSubjectCode) {
        toast({ variant: 'destructive', title: 'Error', description: 'Nama dan kode mata pelajaran tidak boleh kosong.' });
        return;
    }
    if (subjects.some(s => s.code.toLowerCase() === newSubjectCode.toLowerCase() && s.id !== editingItem?.id)) {
        toast({ variant: 'destructive', title: 'Error', description: 'Kode mata pelajaran sudah ada.' });
        return;
    }

    if (editingItem) { // Editing
      setSubjects(subjects.map(s => s.id === editingItem.id ? { ...s, name: newSubjectName, code: newSubjectCode } : s));
      toast({ title: 'Sukses', description: 'Data mata pelajaran berhasil diperbarui.' });
    } else { // Adding
      const newSubject: Subject = { id: Date.now().toString(), name: newSubjectName, code: newSubjectCode };
      setSubjects([newSubject, ...subjects]);
      toast({ title: 'Sukses', description: 'Mata pelajaran baru berhasil ditambahkan.' });
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };
  
  const confirmDelete = () => {
    if (!itemToDelete) return;
    setSubjects(subjects.filter((s) => s.id !== itemToDelete.id));
    toast({ title: 'Dihapus', description: `Mata pelajaran "${itemToDelete.name}" telah dihapus.` });
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };
  
  const handleRefresh = () => {
      setSubjects(formattedInitialSubjects);
      localStorage.removeItem(SUBJECT_STORAGE_KEY);
      toast({ title: 'Refresh', description: 'Data mata pelajaran telah dikembalikan ke data awal.' });
  };

  const handleImport = () => {
    setIsImportDialogOpen(false);
    toast({ title: 'Import Berhasil (Simulasi)', description: 'Data mata pelajaran telah diimpor.' });
  };


  return (
    <div className="space-y-6">
      <Card>
          <CardHeader className="flex-row items-center justify-between">
              <div>
                  <CardTitle>Filter & Aksi</CardTitle>
                  <CardDescription>Cari atau tambah data mata pelajaran.</CardDescription>
              </div>
              <div className="flex gap-2">
                  <Button onClick={() => handleOpenForm(null)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Tambah
                  </Button>
                   <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
                      <Upload className="mr-2 h-4 w-4" /> Import
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleRefresh}>
                      <RefreshCw className="h-5 w-5" />
                  </Button>
              </div>
          </CardHeader>
          <CardContent>
              <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                      placeholder="Cari berdasarkan nama atau kode..." 
                      className="pl-8" 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                  />
              </div>
          </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-4">
            <CardTitle className="text-lg">Daftar Mata Pelajaran</CardTitle>
            <CardDescription className="text-primary-foreground/80">Total: {filteredSubjects.length} mata pelajaran</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No.</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Mata Pelajaran</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.map((subject, index) => (
                  <TableRow key={subject.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell><Badge variant="secondary">{subject.code}</Badge></TableCell>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20" onClick={() => handleOpenForm(subject)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(subject)}
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

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject-name" className="text-right">Nama</Label>
              <Input id="subject-name" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} className="col-span-3" placeholder="cth. Matematika" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject-code" className="text-right">Kode</Label>
              <Input id="subject-code" value={newSubjectCode} onChange={e => setNewSubjectCode(e.target.value)} className="col-span-3" placeholder="cth. MTK" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button onClick={handleSaveSubject}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{itemToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
                <DialogTitle>Import Data Mata Pelajaran</DialogTitle>
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
                <Button onClick={handleImport}><Upload className="mr-2 h-4 w-4" />Import</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
