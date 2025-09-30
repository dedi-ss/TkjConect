"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Check, X, BookOpen, AlertTriangle } from "lucide-react";
import { students, classes } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { cn } from "@/lib/utils";

type AttendanceStatus = "Hadir" | "Sakit" | "Izin" | "Alpha";
type AttendanceRecord = {
  studentId: string;
  status: AttendanceStatus;
};

export default function ManualAttendancePage() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<string>("XII RPL 1");
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  const studentsInClass = students.filter(s => s.class === selectedClass);

  const getStudentImage = (avatarId: string) => {
    return placeholderImages.placeholderImages.find(p => p.id === avatarId);
  }

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => {
      const existingRecord = prev.find(r => r.studentId === studentId);
      if (existingRecord) {
        return prev.map(r => r.studentId === studentId ? { ...r, status } : r);
      }
      return [...prev, { studentId, status }];
    });
  };

  const getStudentStatus = (studentId: string): AttendanceStatus | 'Belum Absen' => {
      return attendance.find(r => r.studentId === studentId)?.status || 'Belum Absen';
  }

  const getStatusColor = (status: AttendanceStatus | 'Belum Absen') => {
      switch(status) {
          case 'Hadir': return 'bg-green-500 text-white';
          case 'Sakit': return 'bg-orange-500 text-white';
          case 'Izin': return 'bg-blue-500 text-white';
          case 'Alpha': return 'bg-red-500 text-white';
          default: return 'bg-gray-400 text-white';
      }
  }


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex items-center justify-between sticky top-0 z-10">
        <Button onClick={() => router.push('/mobile/guru')} variant="ghost" size="icon">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Absensi Manual</h1>
        <div className="w-10"></div>
      </header>

      <main className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            <Label htmlFor="class-select">Pilih Kelas</Label>
            <Select onValueChange={setSelectedClass} value={selectedClass}>
              <SelectTrigger id="class-select">
                <SelectValue placeholder="Pilih kelas..." />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">Pilih kelas untuk memulai absensi manual.</p>
          </CardContent>
        </Card>

        {studentsInClass.map(student => {
            const status = getStudentStatus(student.id);
            const image = getStudentImage(student.avatar);
            return (
                <Card key={student.id} className="shadow-sm">
                    <CardContent className="p-3 flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            {image && <AvatarImage src={image.imageUrl} alt={student.name} data-ai-hint="student portrait" />}
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">{student.name}</p>
                            <p className="text-sm text-muted-foreground">NIS: {student.nis}</p>
                            <Badge className={cn("mt-1", getStatusColor(status))}>{status}</Badge>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Button size="icon" variant={status === 'Hadir' ? 'default': 'outline'} className="h-7 w-7 bg-green-100 text-green-700 border-green-300" onClick={() => handleStatusChange(student.id, 'Hadir')}><Check className="h-4 w-4"/></Button>
                            <Button size="icon" variant={status === 'Sakit' ? 'default': 'outline'} className="h-7 w-7 bg-orange-100 text-orange-700 border-orange-300" onClick={() => handleStatusChange(student.id, 'Sakit')}><AlertTriangle className="h-4 w-4"/></Button>
                            <Button size="icon" variant={status === 'Izin' ? 'default': 'outline'} className="h-7 w-7 bg-blue-100 text-blue-700 border-blue-300" onClick={() => handleStatusChange(student.id, 'Izin')}><BookOpen className="h-4 w-4"/></Button>
                            <Button size="icon" variant={status === 'Alpha' ? 'default': 'outline'} className="h-7 w-7 bg-red-100 text-red-700 border-red-300" onClick={() => handleStatusChange(student.id, 'Alpha')}><X className="h-4 w-4"/></Button>
                        </div>
                    </CardContent>
                </Card>
            )
        })}
      </main>
      
      <footer className="sticky bottom-0 bg-background p-4 border-t shadow-lg">
        <Button className="w-full h-12 text-lg">Simpan Absensi</Button>
      </footer>
    </div>
  );
}
