"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BookCopy,
  FileText,
  LayoutDashboard,
  LogOut,
  QrCode,
  Shield,
  UserCheck,
  UserCog,
  Users,
  BookMarked
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {
      title: "MENU",
      items: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Absensi",
          icon: UserCheck,
          subItems: [
            {
              href: "/dashboard/absensi/siswa",
              label: "Absensi Siswa",
            },
            {
              href: "/dashboard/absensi/guru",
              label: "Absensi Guru",
            },
          ],
        },
      ],
    },
    {
      title: "MASTER DATA",
      items: [
        {
          href: "/dashboard/data/siswa",
          label: "Data Siswa",
          icon: Users,
        },
        {
          href: "/dashboard/data/guru",
          label: "Data Guru",
          icon: UserCog,
        },
        {
          href: "/dashboard/data/kelas",
          label: "Data Kelas & Jurusan",
          icon: BookCopy,
        },
        {
          href: "/dashboard/data/mata-pelajaran",
          label: "Data Mata Pelajaran",
          icon: BookMarked,
        },
        {
          href: "/dashboard/data/petugas",
          label: "Data Petugas",
          icon: Shield,
        },
      ],
    },
    {
      title: "PENGATURAN",
      items: [
        {
          href: "/dashboard/qr",
          label: "Generate QR Code",
          icon: QrCode,
        },
        {
          href: "/dashboard/laporan",
          label: "Generate Laporan",
          icon: FileText,
        },
      ],
    },
];

export function Sidebar() {
  const pathname = usePathname();

  const renderLink = (item: { href: string; label: string; icon?: any }) => (
    <Button
      asChild
      variant={pathname === item.href ? "secondary" : "ghost"}
      className="w-full justify-start gap-3 px-3"
    >
      <Link href={item.href}>
        {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
        <span className="text-base truncate">{item.label}</span>
      </Link>
    </Button>
  );

  const renderAccordionItem = (item: { label: string; icon: any; subItems: { href: string; label: string }[] }) => {
    const isActive = item.subItems.some(si => pathname === si.href);
    return (
    <AccordionItem value={item.label} className="border-b-0">
      <AccordionTrigger
        className={cn(
          "justify-start gap-3 px-3 py-2 text-base hover:no-underline rounded-md hover:bg-muted",
          isActive && "bg-secondary text-primary hover:bg-secondary",
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span className="text-base truncate">{item.label}</span>
      </AccordionTrigger>
      <AccordionContent className="pl-8 pt-1">
        <div className="mt-1 flex flex-col gap-1 border-l-2 border-primary/20">
          {item.subItems.map((subItem) => (
            <Button
              key={subItem.href}
              asChild
              variant={pathname === subItem.href ? "secondary" : "ghost"}
              className="h-auto w-full justify-start py-2 pl-4 text-base font-normal"
            >
              <Link href={subItem.href}>{subItem.label}</Link>
            </Button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
    );
  };

  return (
    <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 text-primary">
              <path fill="currentColor" d="M9 22H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6v2H3v16h6zm4-18h6a2 2 0 0 1 2 2v6h-2V6h-6zm0 10h6a2 2 0 0 1 2 2v6h-2v-6h-6zM9 4.5a2.5 2.5 0 0 1 0 5a2.5 2.5 0 0 1 0-5M9 6a1 1 0 0 0 0 2a1 1 0 0 0 0-2" />
            </svg>
            <h1 className="text-xl font-bold font-headline text-primary">EduTrack</h1>
        </div>
        <nav className="flex-1 space-y-4 overflow-y-auto p-2">
            {menuItems.map((section) => (
            <div key={section.title}>
                <h2 className="mb-2 px-2 text-sm font-semibold uppercase text-muted-foreground tracking-wider">
                {section.title}
                </h2>
                <div className="flex flex-col gap-1">
                {section.items.map((item) =>
                    "href" in item ? (
                    <div key={item.href}>{renderLink(item)}</div>
                    ) : (
                    <Accordion key={item.label} type="single" collapsible defaultValue={item.subItems.some(si => pathname.startsWith(si.href)) ? item.label : undefined} className="w-full">
                        {renderAccordionItem(item)}
                    </Accordion>
                    )
                )}
                </div>
            </div>
            ))}
        </nav>
        <div className="mt-auto border-t p-2">
             <Button variant="ghost" className="w-full justify-start gap-3 px-3">
                <LogOut className="h-5 w-5" />
                <span className="text-base">Logout</span>
             </Button>
        </div>
    </div>
  );
}
