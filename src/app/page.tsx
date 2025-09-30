"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, ArrowRight } from 'lucide-react';

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary">TKJ Conect</h1>
            <p className="text-muted-foreground text-lg mt-2">Sistem Absensi Digital Terintegrasi</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Monitor className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Portal Admin</CardTitle>
                  <CardDescription>Untuk Guru & Staf Administrasi</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Kelola data siswa, guru, kelas, dan lihat laporan absensi lengkap melalui portal web.
              </p>
              <Button onClick={() => router.push('/dashboard')} className="w-full">
                Buka Portal Admin <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Smartphone className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Aplikasi Mobile</CardTitle>
                  <CardDescription>Untuk Siswa & Guru</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Lakukan absensi dengan cepat menggunakan QR code atau catat absensi manual langsung dari ponsel Anda.
              </p>
              <Button onClick={() => router.push('/mobile/login')} className="w-full">
                Buka Aplikasi Mobile <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
