"use client";

import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
    title: string;
    subtitle: string;
    icon?: LucideIcon;
    children?: React.ReactNode; // For the "Add" button
}

export function SectionHeader({ title, subtitle, icon: Icon, children }: SectionHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b-2 border-muted pb-8 gap-4 lg:gap-0">
            <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
                    {subtitle}
                </span>
                <h2 className="text-3xl font-black flex items-center gap-3">
                    {Icon && <Icon className="h-6 w-6" />}
                    {title}
                </h2>
            </div>
            {children}
        </div>
    );
}
