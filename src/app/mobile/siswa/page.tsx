"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { QrCode, LogOut, History } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';

export default function SiswaDashboardPage() {
  const router = useRouter();
  const studentAvatar = placeholderImages.placeholderImages.find(p => p.id === 'student-avatar-1');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex items-center justify-between">
        <div>
            <h1 className="text-xl font-bold">Dasbor Siswa</h1>
            <p className="text-sm opacity-90">Selamat datang, Ahmad Budi!</p>
        </div>
        <Link href="/mobile/login" passHref>
            <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
            </Button>
        </Link>
      </header>

      <main className="p-4 space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Avatar className="h-16 w-16">
              {studentAvatar && <AvatarImage src={studentAvatar.imageUrl} alt="Ahmad Budi" data-ai-hint="student portrait" />}
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">Ahmad Budi Santoso</CardTitle>
              <CardDescription>NIS: 12345 | Kelas: XII RPL 1</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="text-center shadow-lg">
          <CardHeader>
            <CardTitle>Absensi Hari Ini</CardTitle>
            <CardDescription>Jumat, 30 September 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold text-primary">07:05</p>
            <p className="text-lg font-medium text-green-600 mt-2">Hadir</p>
            <p className="text-sm text-muted-foreground">Scan QR Code berhasil</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
            <Button 
                onClick={() => router.push('/mobile/scan?role=siswa')} 
                className="h-24 text-lg"
            >
                <QrCode className="h-8 w-8 mr-4" />
                Scan QR Absensi
            </Button>
            <Button variant="outline" className="h-16 text-md">
                <History className="h-6 w-6 mr-3" />
                Lihat Riwayat Absensi
            </Button>
        </div>
      </main>
    </div>
  );
}
