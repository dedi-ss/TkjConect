import { Users, UserCog, BookOpen, Shield, type LucideIcon } from "lucide-react";
import type { StatCard, Attendance, Student, Teacher } from "./types";

export const statCards: StatCard[] = [
  {
    label: "Total Siswa",
    value: "1,250",
    icon: Users,
  },
  {
    label: "Total Guru",
    value: "80",
    icon: UserCog,
  },
  {
    label: "Total Kelas",
    value: "30",
    icon: BookOpen,
  },
  {
    label: "Total Petugas",
    value: "5",
    icon: Shield,
  },
];

export const attendanceTrendData = [
  { date: "Sen", Hadir: 95, "Tidak Hadir": 5 },
  { date: "Sel", Hadir: 92, "Tidak Hadir": 8 },
  { date: "Rab", Hadir: 98, "Tidak Hadir": 2 },
  { date: "Kam", Hadir: 93, "Tidak Hadir": 7 },
  { date: "Jum", Hadir: 90, "Tidak Hadir": 10 },
  { date: "Sab", Hadir: 85, "Tidak Hadir": 15 },
];

export const recentAttendance: Attendance[] = [
    { name: "Ahmad Budi", avatar: "student-avatar-1", class: "XII RPL 1", checkInTime: "07:05", status: "Hadir" },
    { name: "Citra Lestari", avatar: "student-avatar-2", class: "XII RPL 1", checkInTime: "07:10", status: "Hadir" },
    { name: "Deni Setiawan", avatar: "student-avatar-3", class: "XI TKJ 2", checkInTime: "07:20", status: "Terlambat" },
    { name: "Eka Putri", avatar: "student-avatar-4", class: "X MM 3", checkInTime: "07:01", status: "Hadir" },
    { name: "Fajar Nugraha", avatar: "student-avatar-5", class: "XII RPL 1", checkInTime: "07:12", status: "Hadir" },
];

export const students: Student[] = [
    { id: '1', nis: '12345', name: 'Ahmad Budi Santoso', class: 'XII RPL 1', gender: 'L', status: 'Aktif', avatar: 'student-avatar-1' },
    { id: '2', nis: '12346', name: 'Citra Lestari Dewi', class: 'XII RPL 1', gender: 'P', status: 'Aktif', avatar: 'student-avatar-2' },
    { id: '3', nis: '12347', name: 'Deni Setiawan Putra', class: 'XI TKJ 2', gender: 'L', status: 'Aktif', avatar: 'student-avatar-3' },
    { id: '4', nis: '12348', name: 'Eka Putri Wulandari', class: 'X MM 3', gender: 'P', status: 'Tidak Aktif', avatar: 'student-avatar-4' },
    { id: '5', nis: '12349', name: 'Fajar Nugraha', class: 'XII RPL 1', gender: 'L', status: 'Aktif', avatar: 'student-avatar-5' },
    { id: '6', nis: '12350', name: 'Gita Amelia', class: 'XI TKJ 2', gender: 'P', status: 'Aktif', avatar: 'student-avatar-1' },
    { id: '7', nis: '12351', name: 'Hadi Prasetyo', class: 'X MM 3', gender: 'L', status: 'Aktif', avatar: 'student-avatar-2' },
    { id: '8', nis: '12352', name: 'Indah Permata', class: 'X MM 3', gender: 'P', status: 'Aktif', avatar: 'student-avatar-2' },
];

export const teachers: Teacher[] = [
    { id: '1', nip: '196805121994032008', name: 'Dr. Siti Nurhaliza, S.Pd., M.Pd', subject: 'Matematika', gender: 'P', status: 'Aktif', avatar: 'user-avatar-1' },
    { id: '2', nip: '198203151997031004', name: 'Ahmad Fauzi, S.Kom., M.T', subject: 'RPL', gender: 'L', status: 'Aktif', avatar: 'user-avatar-1' },
    { id: '3', nip: '197506082006042018', name: 'Dra. Indira Sari, M.Pd', subject: 'Bahasa Indonesia', gender: 'P', status: 'Aktif', avatar: 'user-avatar-1' },
    { id: '4', nip: '198912102015032007', name: 'Sri Wahyuni, S.Pd', subject: 'Bahasa Inggris', gender: 'P', status: 'Aktif', avatar: 'user-avatar-1' },
]

export const classes = ['XII RPL 1', 'XII RPL 2', 'XI TKJ 1', 'XI TKJ 2', 'X MM 1', 'X MM 2', 'X MM 3'];
export const majors = ['Rekayasa Perangkat Lunak', 'Teknik Komputer & Jaringan', 'Multimedia'];