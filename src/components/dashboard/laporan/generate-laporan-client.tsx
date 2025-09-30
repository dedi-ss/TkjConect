"use client";

import { useState } from 'react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import {
  Calendar as CalendarIcon,
  FileText,
  Download,
  Eye,
  FileSpreadsheet,
  CalendarDays,
  CalendarCheck,
  CalendarClock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const reportTypes = [
  'Rekap Harian',
  'Rekap Mingguan',
  'Rekap Bulanan',
  'Laporan Absensi Siswa',
  'Laporan Absensi Guru',
  'Laporan Keterlambatan',
];

export function GenerateLaporanClient() {
  const [reportType, setReportType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const handleGenerateReport = () => {
    if (!reportType || !startDate || !endDate) {
      toast({
        variant: 'destructive',
        title: 'Parameter Tidak Lengkap',
        description: 'Silakan pilih jenis laporan, tanggal mulai, dan tanggal selesai.',
      });
      return;
    }
    toast({
      title: 'Laporan Dibuat',
      description: `Laporan "${reportType}" dari ${format(startDate, 'dd/MM/yy')} - ${format(endDate, 'dd/MM/yy')} telah dibuat.`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Parameter Laporan</CardTitle>
            <CardDescription>Pilih parameter untuk membuat laporan absensi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="report-type">Jenis Laporan</Label>
              <Select onValueChange={setReportType} value={reportType ?? undefined}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Pilih jenis laporan..." />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Tanggal Mulai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="start-date"
                      variant="outline"
                      className={cn('w-full justify-start text-left font-normal mt-1', !startDate && 'text-muted-foreground')}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'dd/MM/yyyy') : <span>dd/mm/yyyy</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="end-date">Tanggal Selesai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="end-date"
                      variant="outline"
                      className={cn('w-full justify-start text-left font-normal mt-1', !endDate && 'text-muted-foreground')}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'dd/MM/yyyy') : <span>dd/mm/yyyy</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <Button onClick={handleGenerateReport} className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Generate Laporan
            </Button>
          </CardContent>
        </Card>

        {/* Generated Report Preview (Placeholder) */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Hasil Laporan</CardTitle>
                    <CardDescription>Preview laporan yang telah digenerate akan muncul di sini.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm"><FileSpreadsheet className="mr-2 h-4 w-4"/>Download Excel</Button>
                    <Button size="sm"><Download className="mr-2 h-4 w-4"/>Download PDF</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg p-8 text-center text-muted-foreground bg-gray-50 dark:bg-gray-800/50">
                    <p>Silakan generate laporan untuk melihat hasilnya.</p>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start"><CalendarDays className="mr-2 h-4 w-4" /> Absensi Hari Ini</Button>
            <Button variant="outline" className="w-full justify-start"><CalendarCheck className="mr-2 h-4 w-4" /> Rekap Minggu Ini</Button>
            <Button variant="outline" className="w-full justify-start"><CalendarClock className="mr-2 h-4 w-4" /> Rekap Bulan Ini</Button>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Informasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                    <AlertTitle className="text-blue-800 dark:text-blue-300">Format Laporan:</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                    <ul className="list-disc list-inside space-y-1">
                        <li>PDF untuk laporan formal</li>
                        <li>Excel untuk analisis data</li>
                        <li>Preview untuk melihat hasil</li>
                    </ul>
                    </AlertDescription>
                </Alert>
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <AlertTitle className="text-green-800 dark:text-green-300">Tips:</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-400">
                    <ul className="list-disc list-inside space-y-1">
                        <li>Pilih rentang tanggal yang sesuai</li>
                        <li>Gunakan filter kelas untuk laporan spesifik</li>
                        <li>Download dalam format yang dibutuhkan</li>
                    </ul>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Laporan Tersedia</CardTitle>
                <CardDescription>Daftar laporan yang telah dibuat.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center bg-muted/50 p-3 rounded-md">
                    <div>
                        <p className="text-sm font-semibold">Rekap Mingguan (XII RPL 1)</p>
                        <p className="text-xs text-muted-foreground">01/07/24 - 07/07/24 | PDF, Excel</p>
                    </div>
                    <Button variant="ghost" size="icon">
                        <Eye className="h-5 w-5"/>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
