"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Edit, RefreshCw } from "lucide-react";
import type { Teacher } from "@/lib/types";

type AttendanceStatus = "Hadir" | "Sakit" | "Izin" | "Alpha";
type TeacherAttendanceRecord = {
  teacher: Teacher;
  status: AttendanceStatus;
  checkInTime: string | null;
  checkOutTime: string | null;
  notes?: string;
};

const initialAttendanceData = (teachers: Teacher[]): TeacherAttendanceRecord[] => teachers.map(teacher => ({
  teacher,
  status: "Hadir",
  checkInTime: "07:00",
  checkOutTime: "15:30",
  notes: ""
}));

export function TeacherAttendanceClient({ teachers }: { teachers: Teacher[] }) {
  const [date, setDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<TeacherAttendanceRecord[]>(initialAttendanceData(teachers));
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherAttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>("Hadir");
  const [editNotes, setEditNotes] = useState("");

  const handleEditClick = (record: TeacherAttendanceRecord) => {
    setSelectedTeacher(record);
    setEditStatus(record.status);
    setEditNotes(record.notes || "");
    setIsEditDialogOpen(true);
  };
  
  const handleSaveChanges = () => {
    if (selectedTeacher) {
      setAttendanceData(prevData =>
        prevData.map(record =>
          record.teacher.id === selectedTeacher.teacher.id
            ? { ...record, status: editStatus, notes: editNotes, checkInTime: editStatus === 'Hadir' ? record.checkInTime : null, checkOutTime: editStatus === 'Hadir' ? record.checkOutTime : null }
            : record
        )
      );
    }
    setIsEditDialogOpen(false);
    setSelectedTeacher(null);
  };

  const getStatusColorClass = (status: AttendanceStatus) => {
    switch (status) {
        case 'Hadir':
            return 'bg-green-500 hover:bg-green-600';
        case 'Sakit':
            return 'bg-orange-500 hover:bg-orange-600';
        case 'Izin':
            return 'bg-blue-500 hover:bg-blue-600';
        case 'Alpha':
            return 'bg-gray-500 hover:bg-gray-600';
        default:
            return 'bg-primary';
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Label>Tanggal</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => setDate(newDate || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Absensi Guru</CardTitle>
            <p className="text-sm text-muted-foreground">Daftar absensi guru pada tanggal terpilih.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Nama Guru</TableHead>
                <TableHead>Kehadiran</TableHead>
                <TableHead>Jam Masuk</TableHead>
                <TableHead>Jam Pulang</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((record, index) => (
                <TableRow key={record.teacher.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{record.teacher.nip}</TableCell>
                  <TableCell>{record.teacher.name}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-white", getStatusColorClass(record.status))}>
                        {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.checkInTime || "-"}</TableCell>
                  <TableCell>{record.checkOutTime || "-"}</TableCell>
                  <TableCell>{record.notes || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(record)}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="ml-2">Edit</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kehadiran: {selectedTeacher?.teacher.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block">Status Kehadiran</Label>
            <RadioGroup
              defaultValue={selectedTeacher?.status}
              onValueChange={(value: string) => setEditStatus(value as AttendanceStatus)}
              className="flex space-x-4"
            >
              {(["Hadir", "Sakit", "Izin", "Alpha"] as AttendanceStatus[]).map(status => (
                 <div className="flex items-center space-x-2" key={status}>
                    <RadioGroupItem value={status} id={`status-${status}`} />
                    <Label htmlFor={`status-${status}`}>{status}</Label>
                 </div>
              ))}
            </RadioGroup>
          </div>
          {(editStatus === "Sakit" || editStatus === "Izin") && (
            <div>
              <Label htmlFor="notes">Keterangan</Label>
              <Textarea
                id="notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Tambahkan keterangan (misal: surat dokter, acara keluarga, dll)"
              />
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button onClick={handleSaveChanges}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
