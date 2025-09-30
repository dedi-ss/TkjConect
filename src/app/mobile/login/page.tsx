"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Info, GraduationCap, ChevronLeft, User, Users } from 'lucide-react';
import Link from 'next/link';

export default function MobileLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'student') {
      router.push('/mobile/siswa');
    } else {
      router.push('/mobile/guru');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali</span>
      </Link>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <GraduationCap className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Absensi Mobile</CardTitle>
          <CardDescription>Masuk sebagai siswa atau guru/petugas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 mb-6 bg-muted p-1 rounded-md">
            <Button
              variant={role === 'student' ? 'secondary' : 'ghost'}
              onClick={() => setRole('student')}
              className="flex-1 shadow-sm"
            >
              <Users className="mr-2 h-4 w-4" /> Siswa
            </Button>
            <Button
              variant={role === 'teacher' ? 'secondary' : 'ghost'}
              onClick={() => setRole('teacher')}
              className="flex-1 shadow-sm"
            >
              <User className="mr-2 h-4 w-4" /> Guru/Petugas
            </Button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email / NIS</Label>
              <Input
                id="email"
                type="text"
                placeholder={role === 'student' ? 'Masukkan NIS Anda' : 'nama@sekolah.ac.id'}
                defaultValue={role === 'student' ? '12345' : 'guru@sekolah.ac.id'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  defaultValue="password123"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  <span className="sr-only">
                    {showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  </span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Masuk
            </Button>
          </form>
          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Hubungi admin sekolah jika mengalami masalah login.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Lupa Password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
