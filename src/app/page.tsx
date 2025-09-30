"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Info, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication logic
    // For now, we'll just redirect to the dashboard
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <GraduationCap className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Absensi Siswa</CardTitle>
          <CardDescription>Masuk ke sistem absensi sekolah</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@sekolah.ac.id"
                defaultValue="admin@sekolah.ac.id"
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
              Hubungi admin sekolah jika mengalami masalah login
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
