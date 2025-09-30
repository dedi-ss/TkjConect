"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Edit, RefreshCw, Search } from "lucide-react";
import type { Teacher } from "@/lib/types";

type AttendanceStatus = "Hadir" | "Sakit" | "Izin" | "Alpha";
type TeacherAttendanceRecord = {
  teacher: Teacher;
  status: AttendanceStatus;
  checkInTime: string | null;
  checkOutTime: string | null;
  notes?: string;
};

const initialAttendanceData = (teachers: Teacher[]): TeacherAttendanceRecord[] => [
    { teacher: teachers[0], status: "Hadir", checkInTime: "07:00", checkOutTime: "15:30", notes: "" },
    { teacher: teachers[1], status: "Hadir", checkInTime: "07:15", checkOutTime: null, notes: "" },
    { teacher: teachers[2], status: "Izin", checkInTime: null, checkOutTime: null, notes: "Dinas Luar" },
    { teacher: teachers[3], status: "Sakit", checkInTime: null, checkOutTime: null, notes: "Sakit demam" },
    ...teachers.slice(4).map(teacher => ({
        teacher,
        status: "Alpha" as AttendanceStatus,
        checkInTime: null,
        checkOutTime: null,
        notes: ""
    }))
];

const StatSummaryCard = ({ title, value, colorClass, textColorClass = "text-gray-800" }: { title: string, value: number, colorClass: string, textColorClass?: string }) => (
    <Card className={`bg-card shadow`}>
        <CardContent className="p-4">
            <h3 className={`text-3xl font-bold ${textColorClass}`}>{value}</h3>
            <p className="text-sm text-muted-foreground">{title}</p>
        </CardContent>
    </Card>
);

export function TeacherAttendanceClient({ teachers }: { teachers: Teacher[] }) {
  const [date, setDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<TeacherAttendanceRecord[]>(initialAttendanceData(teachers));
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherAttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>("Hadir");
  const [editNotes, setEditNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
            ? { ...record, status: editStatus, notes: editNotes, checkInTime: editStatus === 'Hadir' ? "07:00" : null, checkOutTime: editStatus === 'Hadir' ? "15:30" : null }
            : record
        )
      );
    }
    setIsEditDialogOpen(false);
    setSelectedTeacher(null);
  };

  const getStatusBadgeClass = (status: AttendanceStatus) => {
    switch (status) {
        case 'Hadir': return 'bg-green-500 hover:bg-green-600 text-white';
        case 'Sakit': return 'bg-orange-400 hover:bg-orange-500 text-white';
        case 'Izin': return 'bg-blue-500 hover:bg-blue-600 text-white';
        case 'Alpha': return 'bg-red-500 hover:bg-red-600 text-white';
        default: return 'bg-gray-500 text-white';
    }
  };

  const attendanceSummary = useMemo(() => {
    return attendanceData.reduce((acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
    }, {} as Record<AttendanceStatus, number>);
  }, [attendanceData]);

  const filteredTeachers = useMemo(() => {
    return attendanceData.filter(record => {
      const query = searchQuery.toLowerCase();
      return (
        record.teacher.name.toLowerCase().includes(query) ||
        record.teacher.nip.toLowerCase().includes(query) ||
        record.teacher.subject.toLowerCase().includes(query)
      );
    });
  }, [attendanceData, searchQuery]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="date-picker">Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-picker"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : <span>Pilih tanggal</span>}
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
            <div className="relative md:col-span-1">
                <Label htmlFor="search-teacher">Cari Guru</Label>
                <Search className="absolute left-2.5 top-10 h-4 w-4 text-muted-foreground" />
                <Input
                    id="search-teacher"
                    type="search"
                    placeholder="Nama, NIP, atau Mata Pelajaran..."
                    className="w-full pl-8 mt-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div>
                <Button className="w-full bg-primary text-primary-foreground">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Data
                </Button>
            </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatSummaryCard title="Hadir" value={attendanceSummary.Hadir || 0} textColorClass="text-green-600" colorClass="bg-green-100" />
        <StatSummaryCard title="Sakit" value={attendanceSummary.Sakit || 0} textColorClass="text-orange-500" colorClass="bg-orange-100" />
        <StatSummaryCard title="Izin" value={attendanceSummary.Izin || 0} textColorClass="text-blue-500" colorClass="bg-blue-100" />
        <StatSummaryCard title="Alfa" value={attendanceSummary.Alpha || 0} textColorClass="text-red-500" colorClass="bg-red-100" />
      </div>

      <Card>
        <CardHeader className="bg-accent text-accent-foreground rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Daftar Absensi Guru</CardTitle>
              <CardDescription className="text-accent-foreground/80">Total: {filteredTeachers.length} guru</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-accent/80">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Nama Guru</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Kehadiran</TableHead>
                <TableHead>Jam Masuk</TableHead>
                <TableHead>Jam Pulang</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((record, index) => (
                <TableRow key={record.teacher.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{record.teacher.nip}</TableCell>
                  <TableCell className="font-medium">{record.teacher.name}</TableCell>
                  <TableCell>{record.teacher.subject}</TableCell>
                  <TableCell>
                    <Badge className={cn(getStatusBadgeClass(record.status))}>
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
                      <Edit className="h-3 w-3" />
                      <span className="ml-1">Edit</span>
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
              value={editStatus}
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
