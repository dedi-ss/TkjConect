"use client";

import { useState } from 'react';
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
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Class = {
  id: string;
  name: string;
  major: string;
};

type Major = string;

export function ClassMajorClient({
  initialClasses,
  initialMajors,
}: {
  initialClasses: Class[];
  initialMajors: Major[];
}) {
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [majors, setMajors] = useState<Major[]>(initialMajors);

  // States for delete confirmation
  const [isClassDeleteDialogOpen, setIsClassDeleteDialogOpen] = useState(false);
  const [isMajorDeleteDialogOpen, setIsMajorDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Class | Major | null>(null);

  const handleDeleteClassClick = (cls: Class) => {
    setItemToDelete(cls);
    setIsClassDeleteDialogOpen(true);
  };

  const confirmDeleteClass = () => {
    if (itemToDelete && typeof itemToDelete === 'object' && 'id' in itemToDelete) {
      setClasses(classes.filter((c) => c.id !== (itemToDelete as Class).id));
      setIsClassDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteMajorClick = (major: Major) => {
    setItemToDelete(major);
    setIsMajorDeleteDialogOpen(true);
  };

  const confirmDeleteMajor = () => {
    if (itemToDelete && typeof itemToDelete === 'string') {
      setMajors(majors.filter((m) => m !== itemToDelete));
      setIsMajorDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return (
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
                <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah
                </Button>
                <Button size="sm" variant="ghost" className="hover:bg-primary/80">
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
                      <Button variant="outline" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClassClick(cls)}
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
              <CardDescription className="text-primary-foreground/80">Angkatan 2022/2023</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah
                </Button>
                <Button size="sm" variant="ghost" className="hover:bg-primary/80">
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
                  <TableRow key={major}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{major}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMajorClick(major)}
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

      {/* Delete Class Confirmation Dialog */}
      <Dialog open={isClassDeleteDialogOpen} onOpenChange={setIsClassDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDeleteClass}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Major Confirmation Dialog */}
      <Dialog open={isMajorDeleteDialogOpen} onOpenChange={setIsMajorDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus jurusan ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDeleteMajor}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
