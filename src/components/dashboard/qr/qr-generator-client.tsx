"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, QrCode, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export function QrGeneratorClient({ classes }: { classes: string[] }) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const { toast } = useToast();
  const qrImageRef = useRef<HTMLImageElement>(null);

  const generateQrCode = () => {
    if (!selectedClass) {
      toast({
        variant: "destructive",
        title: "Gagal Membuat QR Code",
        description: "Silakan pilih kelas terlebih dahulu.",
      });
      return;
    }
    const today = format(new Date(), 'yyyy-MM-dd');
    const qrData = `${selectedClass}-${today}`;
    // Using api.qrserver.com to generate QR code
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      qrData
    )}&bgcolor=f5f5f5&color=a052de&qzone=1`;
    setQrCodeUrl(url);
    setIsGenerated(true);
    toast({
      title: "QR Code Berhasil Dibuat",
      description: `QR Code untuk kelas ${selectedClass} pada hari ini telah dibuat.`,
    });
  };

  const downloadQrCode = async () => {
    if (!qrCodeUrl || !selectedClass) return;
  
    try {
      // Fetch the image
      const response = await fetch(qrCodeUrl);
      if (!response.ok) {
        throw new Error('Gagal mengunduh gambar QR Code.');
      }
      const blob = await response.blob();
  
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `QR_Absensi_${selectedClass}_${format(new Date(), 'dd-MM-yyyy')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up
  
      toast({
        title: "Unduhan Dimulai",
        description: "File QR Code sedang diunduh.",
      });
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast({
        variant: "destructive",
        title: "Gagal Mengunduh",
        description: "Terjadi kesalahan saat mencoba mengunduh QR Code.",
      });
    }
  };
  
  const handleRegenerate = () => {
    // This will force a re-fetch of the image by adding a timestamp
    if (qrCodeUrl) {
      setQrCodeUrl(prevUrl => `${prevUrl?.split('?')[0]}?${new Date().getTime()}`);
      toast({
        title: "QR Code Dimuat Ulang",
        description: "Gambar QR Code telah diperbarui.",
      });
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pilih Kelas untuk Generate QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="class-select">Kelas</Label>
            <Select onValueChange={setSelectedClass} value={selectedClass || undefined}>
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
          </div>
          <Button onClick={generateQrCode} className="w-full">
            <QrCode className="mr-2 h-4 w-4" />
            Generate QR Code
          </Button>
          {isGenerated && qrCodeUrl && (
            <div className="border-t pt-4 mt-4 space-y-4">
              <h3 className="text-lg font-semibold text-center">QR Code untuk {selectedClass}</h3>
              <div className="flex justify-center items-center p-4 bg-gray-100 rounded-md">
                 <Image
                    ref={qrImageRef}
                    src={qrCodeUrl}
                    alt={`QR Code for ${selectedClass}`}
                    width={250}
                    height={250}
                    className="rounded-md"
                    data-ai-hint="qr code"
                 />
              </div>
              <div className="flex gap-2">
                <Button onClick={downloadQrCode} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download (.png)
                </Button>
                <Button onClick={handleRegenerate} variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Re-generate
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Informasi QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle className="text-blue-800">Cara Penggunaan:</AlertTitle>
            <AlertDescription className="text-blue-700">
              <ol className="list-decimal list-inside space-y-1">
                <li>Pilih kelas yang akan dibuat QR Code.</li>
                <li>Klik tombol "Generate QR Code".</li>
                <li>QR Code akan muncul dan siap digunakan.</li>
                <li>Siswa dapat scan QR Code untuk absensi.</li>
              </ol>
            </AlertDescription>
          </Alert>
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">Fitur QR Code:</AlertTitle>
            <AlertDescription className="text-green-700">
              <ul className="list-disc list-inside space-y-1">
                <li>QR Code unik untuk setiap kelas.</li>
                <li>Berlaku untuk hari ini saja.</li>
                <li>Dapat di-regenerate jika diperlukan.</li>
                <li>Download dalam format PNG.</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
