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
import type { Student } from "@/lib/types";

type AttendanceStatus = "Hadir" | "Sakit" | "Izin" | "Alpha";
type AttendanceRecord = {
  student: Student;
  status: AttendanceStatus;
  checkInTime: string | null;
  notes?: string;
};

const initialAttendanceData = (students: Student[]): AttendanceRecord[] => students.map(student => ({
  student,
  status: "Hadir",
  checkInTime: "07:10",
  notes: ""
}));

export function StudentAttendanceClient({ students, classes }: { students: Student[], classes: string[] }) {
  const [selectedClass, setSelectedClass] = useState<string>("XII RPL 1");
  const [date, setDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(initialAttendanceData(students));
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>("Hadir");
  const [editNotes, setEditNotes] = useState("");

  const handleClassSelect = (className: string) => {
    setSelectedClass(className);
  };

  const handleEditClick = (record: AttendanceRecord) => {
    setSelectedStudent(record);
    setEditStatus(record.status);
    setEditNotes(record.notes || "");
    setIsEditDialogOpen(true);
  };
  
  const handleSaveChanges = () => {
    if (selectedStudent) {
      setAttendanceData(prevData =>
        prevData.map(record =>
          record.student.id === selectedStudent.student.id
            ? { ...record, status: editStatus, notes: editNotes, checkInTime: editStatus === 'Hadir' ? record.checkInTime : null }
            : record
        )
      );
    }
    setIsEditDialogOpen(false);
    setSelectedStudent(null);
  };

  const filteredStudents = attendanceData.filter(
    (record) => record.student.class === selectedClass
  );

  const getStatusVariant = (status: AttendanceStatus) => {
    switch (status) {
      case "Hadir":
        return "default";
      case "Sakit":
        return "destructive";
      case "Izin":
        return "secondary";
      case "Alpha":
        return "outline";
      default:
        return "default";
    }
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
        <CardHeader>
          <CardTitle>Daftar Kelas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Silahkan pilih kelas</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {classes.map((className) => (
              <Button
                key={className}
                variant={selectedClass === className ? "default" : "outline"}
                onClick={() => handleClassSelect(className)}
                className={cn("w-full", selectedClass === className ? 'bg-primary text-primary-foreground' : 'bg-card')}
              >
                {className}
              </Button>
            ))}
          </div>
          <div>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Absen Siswa</CardTitle>
            <p className="text-sm text-muted-foreground">Daftar siswa muncul disini</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
            </Button>
            <Badge variant="secondary" className="text-lg">{selectedClass}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>NIS</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Kehadiran</TableHead>
                <TableHead>Jam Masuk</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((record, index) => (
                <TableRow key={record.student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{record.student.nis}</TableCell>
                  <TableCell>{record.student.name}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-white", getStatusColorClass(record.status))}>
                        {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.checkInTime || "-"}</TableCell>
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
            <DialogTitle>Edit Kehadiran: {selectedStudent?.student.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block">Status Kehadiran</Label>
            <RadioGroup
              defaultValue={selectedStudent?.status}
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
