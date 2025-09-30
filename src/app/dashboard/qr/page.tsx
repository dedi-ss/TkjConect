import { PageHeader } from "@/components/page-header";
import { QrGeneratorClient } from "@/components/dashboard/qr/qr-generator-client";
import { classes } from "@/lib/data";

export default function GenerateQrPage() {
    return (
        <>
            <PageHeader title="Generate QR Code" description="Buat QR Code harian untuk absensi kelas." />
            <QrGeneratorClient classes={classes} />
        </>
    );
}
