export type StatCard = {
  label: string;
  value: string;
  icon: React.ElementType;
};

export type Attendance = {
  name: string;
  avatar: string;
  class: string;
  checkInTime: string;
  status: "Hadir" | "Terlambat";
};

export type Student = {
    id: string;
    nis: string;
    name: string;
    class: string;
    gender: 'L' | 'P';
    status: 'Aktif' | 'Tidak Aktif';
    avatar: string;
}

export type Teacher = {
    id: string;
    nip: string;
    name: string;
    subject: string;
    gender: 'L' | 'P';
    status: 'Aktif' | 'Tidak Aktif';
    avatar: string;
}

export type Officer = {
    id: string;
    nip: string;
    name: string;
    position: string;
    department: string;
    gender: 'L' | 'P';
    status: 'Aktif' | 'Tidak Aktif';
    avatar: string;
}

export type AttendanceStatus = "Hadir" | "Sakit" | "Izin" | "Alpha";

export type AttendanceRecord = {
  student: Student;
  status: AttendanceStatus;
  checkInTime: string | null;
  notes?: string;
};
