"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Camera, ChevronLeft, Zap } from 'lucide-react';

export default function ScanQrPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      // Check for mediaDevices support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Perangkat Tidak Didukung',
          description: 'Perangkat Anda tidak mendukung akses kamera.',
        });
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Akses Kamera Ditolak',
          description: 'Silakan izinkan akses kamera di pengaturan browser Anda.',
        });
      }
    };

    getCameraPermission();
    
    // Cleanup function to stop the camera stream when the component unmounts
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [toast]);

  const handleBack = () => {
    const backPath = role === 'guru' ? '/mobile/guru' : '/mobile/siswa';
    router.push(backPath);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="p-4 flex items-center justify-between z-10">
        <Button onClick={handleBack} variant="ghost" size="icon">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold">Pindai QR Code</h1>
        <Button variant="ghost" size="icon">
          <Zap className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="w-full max-w-md aspect-square relative">
            <video ref={videoRef} className="w-full h-full object-cover rounded-2xl" autoPlay muted playsInline />
            <div className="absolute inset-0 border-8 border-white/50 rounded-2xl pointer-events-none" />
            <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"/>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"/>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"/>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"/>
            </div>
        </div>

        {hasCameraPermission === false && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
                <Alert variant="destructive">
                    <Camera className="h-4 w-4" />
                    <AlertTitle>Kamera Tidak Tersedia</AlertTitle>
                    <AlertDescription>
                        Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin akses kamera untuk situs ini di pengaturan browser Anda.
                    </AlertDescription>
                </Alert>
            </div>
        )}
        {hasCameraPermission === null && (
             <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
                <div className="text-center">
                    <Camera className="h-8 w-8 mx-auto animate-pulse" />
                    <p className="mt-2">Meminta izin kamera...</p>
                </div>
            </div>
        )}

      </main>

      <footer className="p-4 text-center z-10">
        <p className="text-muted-foreground">Arahkan kamera ke QR Code yang tersedia di kelas atau yang dipegang oleh siswa.</p>
      </footer>
    </div>
  );
}
