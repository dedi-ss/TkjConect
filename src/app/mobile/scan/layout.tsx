import { Suspense } from 'react';

function ScanQRSuspenseFallback() {
    return null;
}

export default function ScanQrLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Suspense fallback={<ScanQRSuspenseFallback />}>{children}</Suspense>;
}
