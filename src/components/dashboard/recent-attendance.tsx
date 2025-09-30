import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { recentAttendance } from "@/lib/data";
import { cn } from "@/lib/utils";
import placeholderImages from "@/lib/placeholder-images.json";

export function RecentAttendance() {
    const getImage = (id: string) => placeholderImages.placeholderImages.find(p => p.id === id);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Absensi Terbaru</CardTitle>
        <CardDescription>Daftar siswa yang baru saja melakukan absensi.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAttendance.map((item) => {
            const image = getImage(item.avatar);
            return (
            <div className="flex items-center" key={item.name}>
                <Avatar className="h-9 w-9">
                    {image && <AvatarImage src={image.imageUrl} alt={item.name} data-ai-hint="student portrait" />}
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.class}</p>
                </div>
                <div className="ml-auto text-right">
                    <p className="text-sm font-medium">{item.checkInTime}</p>
                    <p className={cn("text-xs", item.status === "Hadir" ? "text-green-600" : "text-orange-500")}>
                        {item.status}
                    </p>
                </div>
            </div>
          )})}
        </div>
      </CardContent>
    </Card>
  );
}
