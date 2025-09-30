import type { PropsWithChildren } from 'react';
import Header from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-card md:block">
        <Sidebar />
      </aside>
      <div className="flex flex-col">
        <Header />
        <main className="flex-1 bg-background p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
