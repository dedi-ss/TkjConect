"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { QrCode, LogOut, UserCheck, CalendarClock, Edit } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';

export default function GuruDashboardPage() {
  const router = useRouter();
  const teacherAvatar = placeholderImages.placeholderImages.find(p => p.id === 'user-avatar-1');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex items-center justify-between">
        <div>
            <h1 className="text-xl font-bold">Dasbor Guru</h1>
            <p className="text-sm opacity-90">Selamat datang, Ahmad Fauzi!</p>
        </div>
        <Link href="/mobile/login" passHref>
            <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
            </Button>
        </Link>
      </header>

      <main className="p-4 space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar className="h-16 w-16">
              {teacherAvatar && <AvatarImage src={teacherAvatar.imageUrl} alt="Ahmad Fauzi" data-ai-hint="person avatar" />}
              <AvatarFallback>AF</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">Ahmad Fauzi, S.Kom., M.T</CardTitle>
              <CardDescription>Guru RPL | NIP: 198203151997031004</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Pencatatan Kehadiran Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <Button variant="outline"><CalendarClock className="mr-2" />Jam Masuk</Button>
                <Button variant="outline"><CalendarClock className="mr-2" />Jam Pulang</Button>
            </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Pilih tindakan untuk mengelola absensi.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <Button onClick={() => router.push('/mobile/scan?role=guru')} className="h-20 text-lg">
                <QrCode className="h-7 w-7 mr-4" />
                Scan QR Siswa
            </Button>
            <Button onClick={() => router.push('/mobile/guru/absensi-manual')} variant="secondary" className="h-20 text-lg">
                <Edit className="h-7 w-7 mr-4" />
                Absensi Manual
            </Button>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
