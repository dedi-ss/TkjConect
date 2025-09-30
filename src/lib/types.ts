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
    gender: 'L' | 'P';
    status: 'Aktif' | 'Tidak Aktif';
    avatar: string;
}
