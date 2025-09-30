import type { PropsWithChildren } from 'react';

type PageHeaderProps = {
    title: string;
    description?: string;
};

export function PageHeader({ title, description, children }: PropsWithChildren<PageHeaderProps>) {
    return (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-headline">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    );
}
